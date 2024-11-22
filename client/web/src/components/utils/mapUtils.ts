import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'

export function getDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371000
  const φ1 = coord1[0] * (Math.PI / 180)
  const φ2 = coord2[0] * (Math.PI / 180)
  const Δφ = (coord2[0] - coord1[0]) * (Math.PI / 180)
  const Δλ = (coord2[1] - coord1[1]) * (Math.PI / 180)

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function UpdateMapCenter({ position }: { position: [number, number] }) {
  const map = useMap()
  const [isInitialZoom, setIsInitialZoom] = useState(true)

  useEffect(() => {
    if (position && isInitialZoom) {
      map.setView(position, 13)
      setIsInitialZoom(false)
    }
  }, [position, map, isInitialZoom])

  return null
}