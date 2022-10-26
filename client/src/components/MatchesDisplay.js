import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const MatchesDisplay = ({ matchedUserNames, setClickedUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const Username = cookies.Username
  const getMatchesProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users', {
        params: { usernames: JSON.stringify(matchedUserNames) }
            })
      setMatchedProfiles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatchesProfile();
  }, [matchedUserNames]);

  return (
    <div className="matches-display">
      {matchedProfiles?.map((match, _index) => (
        <div
          key={_index}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={match?.url} alt={match?.username + " profile"} />
          </div>
          <h3 style={{color: match.color}}>{match?.username}</h3>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
