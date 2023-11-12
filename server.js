// gets parameters from the url
function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  
  // formats millisecond time to minutes and seconds - MM:SS
  function formatMs(time_in_ms) {
    minutes = Math.floor(time_in_ms / 60000);
    seconds = ((time_in_ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  
  /* 
  updates table body with track information
  params: 
    tableBody - element from html page
    tracklist - trackList data from API response
  */
  function updateTableBody(tableBody, trackList) {
    tableBody.innerHTML = ""
    for (const track of trackList) {
  
      const row = document.createElement('tr');
  
      const idCell = document.createElement('td');
      idCell.textContent = track.id;
  
      const titleCell = document.createElement('td');
      titleCell.textContent = `${track.name}`;
  
      const nameCell = document.createElement('td');
      nameCell.textContent = `${track.artists.map(artist => artist.name)}`;
  
      const durationCell = document.createElement('td');
  
      let minutes = Math.floor(track.duration_ms / 60000);
      let seconds = ((track.duration_ms % 60000) / 1000).toFixed(0); //rounds to integer 
      durationCell.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  
      row.appendChild(idCell);
      row.appendChild(titleCell);
      row.appendChild(nameCell);
      row.appendChild(durationCell);
  
      tableBody.appendChild(row);
    }
  
  }
  
  // request top 10 tracks from spotify API
  function retrieveTracks(timeRangeSlug) {
    $.ajax({
      url: `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRangeSlug}`,
      headers: {
        Authorization: "Bearer " + access_token,
      },
      success: function (response) {
        let data = {
          trackList: response.items,
          total: 0,
          json: true,
        };
        for (var i = 0; i < data.trackList.length; i++) {
          data.total += data.trackList[i].duration_ms;
          data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1); // leading 0 so all numbers are 2 digits
        }
        const tableBody = document.getElementById('trackTableBody');
        updateTableBody(tableBody, data.trackList);
        document.getElementById("totalLength").innerText = formatMs(data.total);
      },
    });
  }
  
  // request user's current queue from spotify API
  function getQueue() {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/queue`,
      headers: {
        Authorization: "Bearer " + access_token,
      },
      success: function (response) {
        console.log(response)
        let data = {
          trackList: response.queue,
          total: 0,
          json: true,
        };
        for (var i = 0; i < data.trackList.length; i++) {
          data.total += data.trackList[i].duration_ms;
          data.trackList[i].id = (i + 1 < 10 ? "0" : "") + (i + 1); // leading 0 so all numbers are 2 digits
        }
        const tableBody = document.getElementById('trackTableBody');
        updateTableBody(tableBody, data.trackList);
        document.getElementById("totalValue").innerText = formatMs(data.total);
  
      }
    });
  }
  
  // get access tokens from the URL
  let params = getHashParams();
  let access_token = params.access_token,
    client = params.client,
    error = params.error;
  
  if (error) {
    alert("There was an error during the authentication");
  } else {
    console.log('no error during authentication!')
    if (access_token) {
      $.ajax({
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        success: function (response) {
          $("#login").hide();
          $("#loggedin").show();
        },
      });
    }
    else {
      console.log("no access token!");
    }
  }
  
  // assign functions to top tracks buttons
  document.getElementById("short_term").addEventListener(
    "click",
    function () {
      retrieveTracks("short_term");
    },
    false
  );
  document.getElementById("medium_term").addEventListener(
    "click",
    function () {
      retrieveTracks("medium_term");
    },
    false
  );
  document.getElementById("long_term").addEventListener(
    "click",
    function () {
      retrieveTracks("long_term");
    },
    false
  );
  // assign function to current queue button
  document.getElementById("queue_button").addEventListener(
    "click",
    function () {
      getQueue()
    },
    false
  )