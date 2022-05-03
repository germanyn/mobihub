import { Card, CardContent, CardMedia, Skeleton } from '@mui/material'
import React from 'react'

const CardSkeleton: React.FC = ()  => {
  return (
      <Card>
        <Skeleton variant="rectangular" width="100%" height="140px"  />
        <CardContent>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
        </CardContent>
      </Card>
  )
}

export default CardSkeleton