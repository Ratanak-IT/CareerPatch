import React from 'react'

export default function ButtonSeeMoreComponent() {
  return (
    <>
    <div className="pt-2">
            <ButtonComponent
              text={
                <span className="flex items-center gap-2">
                  See More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 17 7 17 17"/>
                  </svg>
                </span>
              }
              onClick={() => console.log("See More clicked")}
            />
          </div>

    </>
  )
}
