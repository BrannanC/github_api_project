import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Cards = () => {
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState("brannanc");
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchForUser = e => {
    e.preventDefault();
    setUser(userInput);
    setUserInput("");
  };

  const handleChange = e => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    const getRepos = async search_name => {
      setIsLoading(true);
      const user_response = await fetch(
        `https://api.github.com/search/repositories?q=user:${search_name}&sort=stars`
      );
      const user = await user_response.json();
      if (!user.message) {
        const repos_with_languages = await Promise.all(
          user.items.map(async repo => {
            const raw_lan = await fetch(
              `https://api.github.com/repos/${search_name}/${repo.name}/languages`
            );
            const languages = await raw_lan.json();
            return { ...repo, languages };
          })
        );
        setUserData({ repos: repos_with_languages });
      } else {
        setUserData(user);
      }
      setIsLoading(false);
    };
    getRepos(user);
  }, [user]);
  return userData == null || isLoading ? (
    <header className="App-header">
      <div>Loading</div>
    </header>
  ) : (
    <div className="App-header">
      <h1>Repositories for {user}</h1>
      <form onSubmit={searchForUser}>
        <input
          type="text"
          placeholder="Search for a user..."
          name="userInput"
          value={userInput}
          onChange={handleChange}
        />
      </form>
      {userData.message ? (
        <header className="App-header">
          <div>Error user doesn't exist</div>
        </header>
      ) : (
        <div style={container}>
          {userData && !!userData.repos.length ? (
            userData.repos.map(repo => {
              const lang_arr = [];
              for (let lan in repo.languages) {
                lang_arr.push(lan);
              }

              return (
                <Link to={`/${repo.id}`} key={repo.id}>
                  <div className="card" style={cardStyle}>
                    <h3>{repo.name}</h3>
                    <h5>Stars: {repo.stargazers_count}</h5>
                    <div style={infoStyle}>
                      {repo.description && (
                        <div style={descriptionStyle}>
                          <h5>Description:</h5>
                          <p>{repo.description}</p>
                        </div>
                      )}
                      {!!lang_arr.length && (
                        <div style={languagesStyle}>
                          <h5>Languages:</h5>
                          {lang_arr.slice(0, 3).map(lang => (
                            <p key={`${lang} ${repo.id}`}>{lang}</p>
                          ))}
                          {lang_arr.length > 3 && <p>...</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p>no repos</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cards;

const infoStyle = {
  display: "flex",
  justifyContent: "center"
};

const container = {
  width: "90vw",
  maxWidth: "1200px"
};

const languagesStyle = {
  width: "40%",
  magin: "0 auto"
};

const descriptionStyle = {
  width: "60%"
};

const cardStyle = {
  border: "1px solid white",
  width: "90%",
  margin: "5px auto"
};
