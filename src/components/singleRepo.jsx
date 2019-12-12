import React, { useState, useEffect } from "react";

function SingleRepo(props) {
  const [repo, setRepo] = useState(null);
  useEffect(() => {
    const fetchRepo = async () => {
      const repo_raw = await fetch(
        `https://api.github.com/repositories/${props.match.params.id}`
      );
      const result = await repo_raw.json();

      const lang_raw = await fetch(result.languages_url);
      const lang_obj = await lang_raw.json();
      const languages = [];
      for (let lang in lang_obj) {
        languages.push(lang);
      }
      setRepo({ ...result, languages });
    };
    fetchRepo();
  }, [props.match.params.id]);
  return repo ? (
    repo.message ? (
      <header className="App-header">
        <div>Error repo doesn't exist</div>
      </header>
    ) : (
      <div className="App-header">
        <div key={repo.id} style={cardStyle}>
          <div style={nameStyle}>
            <img src={repo.owner.avatar_url} alt="useravatar" />
            <h2>{repo.owner.login}</h2>
          </div>
          <h3>{repo.name}</h3>
          <div style={infoStyle}>
            <div>
              <h5>Stars: {repo.stargazers_count}</h5>
              <h5>Watchers: {repo.watchers_count}</h5>
              <h5>Open Issues: {repo.open_issues_count}</h5>
            </div>
            {repo.description && (
              <div style={descriptionStyle}>
                <h5>Description:</h5>
                <p>{repo.description}</p>
              </div>
            )}

            {!!repo.languages.length && (
              <div style={languagesStyle}>
                <h5>Languages:</h5>
                {repo.languages.map(lang => (
                  <p key={lang}>{lang}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  ) : (
    <header className="App-header">
      <div>Loading Repo</div>
    </header>
  );
}

const infoStyle = {
  display: "flex",
  justifyContent: "center",
  margin: "0 10px"
};

const languagesStyle = {
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

const nameStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

export default SingleRepo;
