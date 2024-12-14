import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const FoodCard = ({ food }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={food.image}
                alt={food.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {food.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {food.description}
                </Typography>
                <Typography variant="h6" color="text.primary">
                    ${food.price}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Add to Order
                </Button>
            </CardContent>
        </Card>
    );
};

export default FoodCard;
