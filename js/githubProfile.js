const USERNAMEFORM = document.getElementById('search-user-form');
const USERNAMEFIELD = document.getElementById('user-field');
const SEARCHBUTTON = document.getElementById('search-user-button');
const USERDETAILS = document.getElementById('user-details');

USERNAMEFORM.addEventListener('submit', submit);
USERDETAILS.addEventListener('click', showRepoList);

class Fetch {
  static fetchUser(username) {
    const SEARCHUSER = new Promise((resolve, reject) => {
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => {
          if (response.status !== 404) {
            return response.json();
          } else {
            reject('User not found');
          }
        })
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });

    return SEARCHUSER;
  }
  static fetchStarred(username) {
    const SEARCHSTARS = new Promise((resolve, reject) => {
      fetch(`https://api.github.com/users/${username}/starred`)
        .then((response) => response.json())
        .then((starredArr) => resolve(starredArr))
        .catch((err) => reject(err));
    });

    return SEARCHSTARS;
  }
  static fetchRepositories(username) {
    const SEARCHREPOS = new Promise((resolve, reject) => {
      fetch(`https://api.github.com/users/${username}/repos`)
        .then((response) => response.json())
        .then((reposArr) => resolve(reposArr))
        .catch((err) => reject(err));
    });

    return SEARCHREPOS;
  }
}

class User {
  constructor(
    photoUrl,
    name,
    login,
    stars,
    repositories,
    followers,
    followings,
    company,
    website,
    location,
    memberSince,
    profileLink
  ) {
    this.photoUrl = photoUrl;
    this.name = name;
    this.login = login;
    this.stars = stars.length;
    this.repositories = repositories;
    this.followers = followers;
    this.followings = followings;
    this.company = company;
    this.website = website;
    this.location = location;
    this.memberSince = new Date(memberSince).toLocaleString('en-US');
    this.profileLink = profileLink;
  }
  userValidations() {
    if (this.name === null) {
      this.name = 'No name';
    }
    if (this.company === null) {
      this.company = 'No company';
    }
    if (this.website === '') {
      this.website = 'No website';
    }
    if (this.location === null) {
      this.location = 'No location';
    }

    return this;
  }
}

class UI {
  static showUserDetails(div, user) {
    div.innerHTML = `
      <div class="user-card">
        <div class="user-profile">
          <img src="${user.photoUrl}" class="user-img"></img>
          <p class="user-name">${user.name}</p>
          <p class="user-login">(<span id="login">${user.login}</span>)</p>
          <a class="user-profile-link" href="${user.profileLink}">Go to profile</a>
          <div class="user-follows">
            <i class="bi bi-people"></i>
            <p>${user.followers} followers</p>
            <p>·</p>
            <p>${user.followings} following</p>
          </div>
          <p class="user-stars"><i class="bi bi-star"></i> ${user.stars}</p>
          <p class="user-date">Member since ${user.memberSince}</p>
        </div>
        <div class="user-details">
          <p><i class="bi bi-journal-album"></i> ${user.repositories} repositories</p>
          <p><i class="bi bi-building"></i> ${user.company}</p>
          <p><i class="bi bi-link-45deg"></i> ${user.website}</p>
          <p><i class="bi bi-geo-alt"></i> ${user.location}</p>
          <div id="repository-list-div">
            <p><a class="show-link" href="#">Show repository list of ${user.login}</a></p>
          </div>
        </div>
      </div>
    `;
  }
  static showUserRepositories(repositoriesArray) {
    let repositoriesList = '';

    for (let repository of repositoriesArray) {
      let description = repository.description;

      if (description === null) {
        description = '';
      }

      repositoriesList += `
        <div class="repository-card">
          <a href="${repository.html_url}" class="repository-link">${repository.name}</a>
          <div class="repository-description">
            <p>${description}</p>
          </div>
          <div class="repository-details">
            <div class="repository-detail">
              <i class="bi bi-star"></i>
              <p>${repository.stargazers_count}</p>
            </div>
            <div class="repository-detail">
              <i class="bi bi-diagram-2"></i>
              <p>${repository.forks}</p>
            </div>
            <div class="repository-detail">
              <i class="bi bi-eye"></i>
              <p>${repository.watchers}</p>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById('repository-list-div').innerHTML = repositoriesList;
  }
}

function submit(e) {
  e.preventDefault();

  const USERNAME = USERNAMEFIELD.value;
  const USERINFORMATION = Fetch.fetchUser(USERNAME);

  USERINFORMATION.then((user) => {
    const {
      login,
      avatar_url,
      name,
      followers,
      following,
      public_repos,
      company,
      blog,
      location,
      created_at,
      html_url,
    } = user;

    const USERSTARS = Fetch.fetchStarred(login);

    USERSTARS.then((starredArr) => {
      let user = new User(
        avatar_url,
        name,
        login,
        starredArr,
        public_repos,
        followers,
        following,
        company,
        blog,
        location,
        created_at,
        html_url
      ).userValidations();

      UI.showUserDetails(USERDETAILS, user);
    }).catch((err) => console.log(err));
  }).catch((err) => alert(err));
}

function showRepoList(e) {
  if (e.target.classList.contains('show-link')) {
    e.preventDefault();

    const USERLOGIN = document.getElementById('login').textContent;
    const USERREPOS = Fetch.fetchRepositories(USERLOGIN);

    USERREPOS.then((reposArr) => {
      UI.showUserRepositories(reposArr);
    }).catch((err) => console.log(err));
  }
}
