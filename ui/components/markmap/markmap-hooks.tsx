'use client'
import React, { useRef, useEffect, useCallback } from 'react'
import { Markmap } from 'markmap-view'
import { transformer } from './markmap'

export default function MarkmapHooks({
  data
}: {
  data: any
}) {

  // Ref for SVG element
  const refSvg = useRef<any>()
  // Ref for markmap object
  const refMm = useRef<Markmap>()

  useEffect(() => {
    // Create markmap and save to refMm
    if (refMm.current) return
    try {
      const mm = Markmap.create(refSvg.current, { duration: 100, pan: false })
      console.log('create', refSvg.current)
      refMm.current = mm
    } catch (e) { }
  }, [refSvg.current])

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current
    if (!mm) return
    const { root } = transformer.transform(data)
    mm.setData(root)
    mm.fit()
  }, [refMm.current, data])

  return (
    <div
      className='relative h-full'
    >
      <svg
        className='w-full h-full dark:text-white'
        ref={refSvg}
      />
    </div>
  )
}

