import React from 'react';
import { Container, Typography, Link, Box } from '@mui/material';

function Footer() {
    return (
        <Box mt={5} py={3} bgcolor="primary.main" color="white">
            <Container maxWidth="lg">
                <Typography variant="body1" align="center">
                    © {new Date().getFullYear()} Restaurant Service. All rights reserved.
                </Typography>
                <Typography variant="body2" align="center">
                    <Link href="#" color="inherit">
                        Privacy Policy
                    </Link>
                    {' | '}
                    <Link href="#" color="inherit">
                        Terms of Service
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;