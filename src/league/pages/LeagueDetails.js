import React from 'react';
import {useParams} from 'react-router-dom';

import './LeagueDetails.css';

const LeagueDetails = (props) => {
    const leagueId = useParams().leagueId;
return <p>{leagueId}</p>;
};

export default LeagueDetails;
