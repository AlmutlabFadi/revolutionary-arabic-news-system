import React, { useState, useEffect } from 'react'

const AnimatedLogo = ({ className = "", size = "normal" }) => {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const sizeClasses = {
    small: "w-32 h-10",
    normal: "w-48 h-14", 
    large: "w-64 h-20"
  }

  const handleLogoClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 5000)
  }

  return (
    <div 
      className={`${sizeClasses[size]} ${className} cursor-pointer transition-transform hover:scale-105`}
      onClick={handleLogoClick}
    >
      {isAnimating ? (
        <img 
          src="/logo-animated.svg" 
          alt="جولان 24 - Golan 24" 
          className="w-full h-full object-contain"
        />
      ) : (
        <img 
          src="/logo-static.svg" 
          alt="جولان 24 - Golan 24" 
          className="w-full h-full object-contain transition-opacity duration-500"
        />
      )}
    </div>
  )
}

export default AnimatedLogo
