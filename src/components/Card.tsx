import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function ImgMediaCard() {
  return (
    <Card sx={{}}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="src/components/heart.jpeg"
      />
      <CardContent>

        <Typography variant="body2" color="text.secondary">
          Read Study Papers related to heart.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
