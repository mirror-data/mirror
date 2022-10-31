import React from "react";
import {Loader, Paper} from "@mantine/core";

interface CardProps {
  isLoaded?: boolean
  error?: string
  initialized?: boolean
  className?: string
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({className, initialized, isLoaded, error, children}) => {
  const PaperProps = {shadow: "xs", p: "md", className}
  if (!initialized) {
    return null
  }
  if (error) {
    return <Paper {...PaperProps}>
      <div className="text-red-500">{error}</div>
    </Paper>
  }
  if (isLoaded) {
    return <Paper {...PaperProps}>
      <Loader />
    </Paper>
  }
  return  <Paper {...PaperProps}>
    {children}
  </Paper>
}


