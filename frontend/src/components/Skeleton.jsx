import React from 'react'

export function Skeleton({ width, height = 16, radius = 6, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  )
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card">
      <Skeleton width="40%" height={14} />
      <Skeleton width="70%" height={22} style={{ marginTop: 10 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={13} style={{ marginTop: 12 }} />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-tile" key={i}>
          <Skeleton width={32} height={32} radius={8} />
          <Skeleton width="60%" height={14} style={{ marginTop: 14 }} />
        </div>
      ))}
    </div>
  )
}
