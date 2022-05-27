import React, { useEffect } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { GridList, GridListTile, GridListTileBar } from '@material-ui/core';


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    upcomingMoviesHeading: {
        textAlign: 'center',
        background: '#ff9999',
        padding: '8px',
        fontSize: '1rem'
    },
    gridListUpcomingMovies: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        width: '100%'
    },

});


const UpcomingMovies = (props) => {

    const [movies, setMovies] = useState([]);

    useEffect( () => {
        axios.get(props.baseUrl + "movies?status=PUBLISHED&limit=6")
                .then(response => setMovies(response.data.movies));

    }, []);

    const { classes } = props;
    
    return (
        <div >
            <div className={props.classes.upcomingMovies}>
                <GridList  cols={5} className={classes.gridListUpcomingMovies}>
                    {
                        movies.map( movie => (
                            <GridListTile key={movie.id}>
                                <img src={movie.poster_url} className="moviePoster" alt={movie.title} />
                                <GridListTileBar title={movie.title} />
                            </GridListTile>
                            )
                        )
                    }
                </GridList>
            </div>
        </div>
    )
}

export default withStyles(styles) (UpcomingMovies);