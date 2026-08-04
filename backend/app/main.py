import json
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas, auth
from .database import engine, get_db
from .pdf_utils import extract_text_from_pdf
from .ai_service import analyze_resume

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Resume Checker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Resume Checker API chal raha hai"}


# ---------- AUTH ----------

@app.post("/auth/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Is email se account pehle se maujood hai.")

    user = models.User(
        name=payload.name,
        email=payload.email,
        hashed_password=auth.hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = auth.create_access_token({"sub": str(user.id)})
    return schemas.Token(access_token=token, user=schemas.UserOut.model_validate(user))


@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ya password galat hai.")

    token = auth.create_access_token({"sub": str(user.id)})
    return schemas.Token(access_token=token, user=schemas.UserOut.model_validate(user))


@app.get("/auth/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


# ---------- RESUME CHECK ----------

@app.post("/resume/check", response_model=schemas.ResumeCheckOut)
async def check_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Sirf PDF files allowed hain.")

    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File 10MB se badi hai.")

    resume_text = extract_text_from_pdf(file_bytes)
    result = analyze_resume(resume_text)

    check = models.ResumeCheck(
        user_id=current_user.id,
        filename=file.filename,
        score=result.get("overall_score"),
        summary=result.get("summary"),
        result_json=json.dumps(result, ensure_ascii=False),
    )
    db.add(check)
    db.commit()
    db.refresh(check)

    return check


@app.get("/resume/history", response_model=list[schemas.ResumeCheckOut])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    checks = (
        db.query(models.ResumeCheck)
        .filter(models.ResumeCheck.user_id == current_user.id)
        .order_by(models.ResumeCheck.created_at.desc())
        .all()
    )
    return checks


@app.get("/resume/history/{check_id}", response_model=schemas.ResumeCheckOut)
def get_check_detail(
    check_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    check = (
        db.query(models.ResumeCheck)
        .filter(models.ResumeCheck.id == check_id, models.ResumeCheck.user_id == current_user.id)
        .first()
    )
    if not check:
        raise HTTPException(status_code=404, detail="Ye check record nahi mila.")
    return check


@app.delete("/resume/history/{check_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_check(
    check_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    check = (
        db.query(models.ResumeCheck)
        .filter(models.ResumeCheck.id == check_id, models.ResumeCheck.user_id == current_user.id)
        .first()
    )
    if not check:
        raise HTTPException(status_code=404, detail="Ye check record nahi mila.")
    db.delete(check)
    db.commit()
    return None
