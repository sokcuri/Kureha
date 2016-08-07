module.exports = (() => {
  const Twitter_text = require('twitter-text');
  const symbol = require('../app/symbols');

  var ex = {
    App: null,
    Tweet: function (tweet, quoted, event, source) {
      var tweet = tweet;
      var quoted = quoted;
      var a = document.createElement('article');
      var className = quoted ? 'tweet quoted' : 'tweet';

      this.id = tweet.id_str;
      this.timestamp = new Date(Date.parse(tweet.created_at)).getTime();
      this.isFavorited = tweet.favorited;
      this.favoriteCount = tweet.favorite_count;
      this.isRetweeted = tweet.retweeted;
      this.retweetCount = tweet.retweet_count;
      this.hasRetweet = tweet.retweeted_status ? true : false;
      if (this.hasRetweet)
        this.retweet = {
          id: tweet.retweeted_status.id_str,
          timestamp: new Date(Date.parse(tweet.retweeted_status.created_at)).getTime(),
          isFavorited: tweet.retweeted_status.favorited,
          favoriteCount: tweet.retweeted_status.favorite_count,
          isRetweeted: tweet.retweeted_status.retweeted,
          retweetCount: tweet.retweeted_status.retweet_count
        };

      a.className = 'tweet_wrapper';

      a.setAttribute('data-tweet-id', tweet.id_str);
      a.setAttribute('data-tweet-timestamp', tweet.timestamp_ms);

      var mentioned_me = false;
      if (!tweet.retweeted_status)
        for (var name of Twitter_text.extractMentions(tweet.text))
          if (name == ex.App.screen_name) mentioned_me = true;
      if (mentioned_me) className += ' tweet_emp blue';

      // retweeted / favorited
      var retweeted = '';
      var favorited = '';
      if (tweet.favorited)
        favorited = 'favorited';
      if (tweet.retweeted || tweet.retweeted_status && tweet.user.id_str == ex.App.id_str)
        retweeted = 'retweeted';

      var id_str_org = tweet.id_str;

      var div = document.createElement('div');
      div.className = className;

      if (event == 'retweeted_retweet') {
        div.innerHTML += `<div class="retweeted_retweeted_tweet">&nbsp;&nbsp;${symbol.retweet}
                <a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${source.screen_name}')">${source.name}</a> 님이 내가 리트윗한 트윗을 리트윗했습니다.</span>`;
        if (tweet.retweeted_status) tweet = tweet.retweeted_status;
      }
      if (event == 'favorited_retweet') {
        div.innerHTML += `<div class="favorited_retweeted_tweet">&nbsp;&nbsp;${symbol.like}
                <a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${source.screen_name}')">${source.name}</a> 님이 내 리트윗을 마음에 들어 합니다.</span>`;
        if (tweet.retweeted_status) tweet = tweet.retweeted_status;
      } else if (tweet.retweeted_status) {
        div.innerHTML += `<div class="retweeted_tweet">${symbol.retweet}<span class="retweeted_tweet_text">&nbsp;
                <a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${tweet.user.screen_name}')">${tweet.user.name}</a> 님이 리트윗했습니다</span></div>`;
        tweet = tweet.retweeted_status;
      } else if (tweet.in_reply_to_status_id_str !== null && !quoted) {
        // 자신의 트윗에 답글 단 경우 즉, 이어쓰기 트윗
        if (tweet.user.screen_name === tweet.in_reply_to_screen_name) {
          var replied_to = tweet.user.name;
        } else {
          var user_mentions = tweet.entities.user_mentions;
          var replied_to = user_mentions[0].name;
        }
        div.innerHTML += `<div class="replied_tweet">${symbol.reply}<span class="replied_tweet_text">&nbsp;
          <a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${tweet.in_reply_to_screen_name}')">${replied_to}</a> 님에게 답글을 보냈습니다</span></div>`;
      }

      var embed = {
        id_str: tweet.id_str,
        user_name: tweet.user.name,
        user_screen_name: tweet.user.screen_name,
        text: tweet.text
      };
      a.setAttribute('data-json', JSON.stringify(embed));

      var permalink = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

      // 텍스트에 링크걸기
      var text_obj = [];
      var entity = [tweet.entities.hashtags, tweet.entities.urls, tweet.entities.user_mentions, (tweet.entities.media ? tweet.entities.media : '')];
      for (ent of entity)
        for (item of ent)
          text_obj.push(item);
      text = Twitter_text.autoLink(tweet.text, {urlEntities: text_obj});

      // 팝업 창에서 링크가 열리게끔 수정
      text = text.replace(/(<a[^>]*) href="([^"]*)"/g, '$1 href="javascript:void(0)" onclick="openPopup(\'$2\')"');

      // @(아이디) 꼴 골뱅이에도 링크가 붙도록 변경
      text = text.replace(/@(<a[^>]* class="tweet-url username" [^>]*>)/g, '$1@');

      // 공백을 <br>로 치환
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');

      // 이모지 파싱
      text = twemoji.parse(text);

      // 프로텍트 이미지
      var tweet_protected = '';
      if (tweet.user.protected) tweet_protected = symbol.protected;

      div.innerHTML += `<img class="profile-image" src="${tweet.user.profile_image_url_https}"></img>
              <div class="tweet-name"><a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${tweet.user.screen_name}')">
              <strong>${tweet.user.name}</strong>
              <span class="tweet-id">@${tweet.user.screen_name}</span></a><span class="user_protected">${tweet_protected}</div></div>
              <p class="tweet-text lpad">${text}</p>`;

      var entities = tweet.extended_entities || tweet.entities || null;
      if (entities.media) {
        var container = document.createElement('div');

        if (entities.media[0].type == 'animated_gif' || entities.media[0].type == 'video') {
          var muted = (entities.media[0].type == 'video') ? 'muted' : '';
          var loop = (entities.media[0].type == 'animated_gif') ? 'loop' : '';
          var type = (entities.media[0].type == 'animated_gif') ? 'tweet-gif' : 'tweet-video';
          container.className = 'tweet-media-container';
          container.innerHTML += `<div class="${type}"><video id="my-video" class="video-js" ${loop} ${muted} autoplay controls preload="auto" poster="${entities.media[0].media_url_https}" data-setup="{}"></video></div>`;

          for (i in entities.media[0].video_info.variants)
            container.getElementsByTagName('video')[0].innerHTML += `<source src="${entities.media[0].video_info.variants[i].url}" type='${entities.media[0].video_info.variants[i].content_type}'>`;

          div.appendChild(container);
        } else {
          var urls = entities.media.map((x) => x.media_url_https);
          var urlstr = urls.join(';');
          container.setAttribute('data-media-count', entities.media.length);
          container.className = 'tweet-media-container';
          for (var i in urls)
            container.innerHTML += `<div class="tweet-image"><a href="javascript:void(0)" onclick="openImageview('${urls[i]}', '${urlstr}')"><img src="${urls[i]}"/></a></div>`;
          div.appendChild(container);
        }
      }

      var quoted_status = tweet.quoted_status || null;
      if (!quoted && quoted_status) {
        var twt = new this.constructor(quoted_status, true);
        div.appendChild(twt.element);
      }

      div.innerHTML += `<div class="tweet-date lpad">
              <a href="javascript:void(0)" onclick="openPopup('${permalink}')">
              ${new Date(Date.parse(tweet.created_at)).format('a/p hh:mm - yyyy년 MM월 dd일')}
              </a> · ${tagRemove(tweet.source)}</div>`;
      if (!tweet.retweet_count)
        tweet.retweet_count = '';
      if (!tweet.favorite_count)
        tweet.favorite_count = '';

      if (!quoted) {
        var _e = document.createElement('div');
        _e.innerHTML += `
          <div aria-label="트윗 작업" role="group" class="tweet-task lpad">
            <div class="tweet-task-box">
              <button aria-label="답글" class="reply" type="button">
                ${symbol.reply}
              </button>
            </div>
            <div class="tweet-task-box ${retweeted}">
              <button aria-label="리트윗" class="retweet" type="button">
                <span class="tweet-task-count">
                  ${symbol.retweet}&nbsp;
                  <span class="retweet-count">${tweet.retweet_count}</span>
                </span>
              </button>
            </div>
            <div class="tweet-task-box ${favorited}">
              <button aria-label="마음에 들어요" class="like" type="button">
                <span class="tweet-task-count">
                  ${symbol.like}&nbsp;
                  <span class="favorite-count">${tweet.favorite_count}</span>
                </span>
              </button>
            </div>
            <div class="tweet-task-box">
              <button aria-label="트윗 메뉴" class="tripledot" type="button">
                <span class="tweet-task-count">
                  &#x2026;
                </span>
              </button>
            </div>
          </div>`;
        
        const tweetMenu = document.createElement('div');
        tweetMenu.className = 'tweet-menu menu-hidden';
        tweetMenu.innerHTML += `
          <div class="menu-basic">
            <a class="item menuitem-copylink" href="#">트윗 링크 복사하기</a>
            <a class="item" href="#">이 트윗을 인용하여 트윗 작성</a>
            <a class="item" href="#">이 유저를 뮤트/블락하기</a>
          </div>
          <hr class="sep">
          <div class="menu-plugin">
            <a class="item" href="#">(나중에 플러그인 시스템을 구현한다면) 여기에 플러그인 메뉴를 넣을지도?</a>
          </div>
        `;
        
        var menuBasic = tweetMenu.querySelector('.menu-basic');
        if (tweet.user.screen_name === ex.App.screen_name) {
          menuBasic.innerHTML += `<a class="item menuitem-delete" href="#">이 트윗 지우기</a>`;
        }

        // 메뉴 항목을 클릭하면 메뉴를 닫는다.
        tweetMenu.addEventListener('click', evt => {
          let clickedItem = evt.target;
          if (clickedItem.classList.contains('item')) {
            tweetMenu.classList.add('menu-hidden');
          }
        });

        this.retweetCountLabel = _e.getElementsByClassName('retweet-count')[0];
        this.favoriteCountLabel = _e.getElementsByClassName('favorite-count')[0];
        var replyButton = _e.getElementsByClassName('reply')[0],
          retweetButton = _e.getElementsByClassName('retweet')[0],
          likeButton = _e.getElementsByClassName('like')[0],
          tripleDotButton = _e.getElementsByClassName('tripledot')[0];
        replyButton.addEventListener('click', evt => tryReply(), false);
        retweetButton.addEventListener('click', evt => execRetweet(), false);
        likeButton.addEventListener('click', evt => execFavorite(), false);
        tripleDotButton.addEventListener('click', evt => {
          tweetMenu.classList.toggle('menu-hidden');
        });
        div.appendChild(_e.firstElementChild);

        tweetMenu.querySelector('.menuitem-copylink').addEventListener('click', evt => {
          clipboard.writeText(permalink);
          ex.App.showMsgBox('클립보드에 트윗 링크를 복사했습니다', 'blue', 1000);
        }, true);
        
        if (tweet.user.screen_name === ex.App.screen_name) {
          tweetMenu.querySelector('.menuitem-delete').addEventListener('click', evt => {
            if (confirm(`다음 트윗을 지우시겠습니까?\r\n\r\n${tweet.text}`)) {
              execDelete();
            }
          }, true);
        }

        div.appendChild(tweetMenu);
      }

      a.appendChild(div);
      this.element = a;

      var tryReply = () => {
        ex.App.tweetUploader.openPanel();
        var usernames = [],
          tweet_author = tweet.user.screen_name;
        if (tweet_author != ex.App.screen_name) usernames.push(tweet_author);
        for (var name of Twitter_text.extractMentions(tweet.text))
          if (name != tweet_author && name != ex.App.screen_name)
            usernames.push(name);

        ex.App.tweetUploader.text = usernames.map(x => '@' + x).join(' ');
        if (ex.App.tweetUploader.text) ex.App.tweetUploader.text += ' ';
        ex.App.tweetUploader.inReplyTo = {id: tweet.id_str, name: tweet.user.name, screen_name: tweet_author, text: tweet.text};
        ex.App.resizeContainer();
      };

      var execRetweet = () => {
        if (!this.isRetweeted) {
          ex.App.showMsgBox('리트윗했습니다', 'blue', 1000);
          ex.App.chkRetweet(tweet.id_str, true, 'auto');
          Client.post(`statuses/retweet/${tweet.id_str}`, (error, tweet, response) => {
            if (error) {
              console.warn(error);
              switch (error[0].code) {
                // already retweeted
                case 327:
                  ex.App.showMsgBox('이미 리트윗한 트윗입니다', 'tomato', 1000);
                  return;
                // rate limit reached
                case 88:
                  ex.App.showMessageBox('API 리밋입니다', 'tomato', 1000);
                  return;
                default:
                  ex.App.showMsgBox(`오류가 발생했습니다<br>${error[0].code}: ${error[0].message}`, 'tomato', 5000);
              }
              ex.App.chkRetweet(tweet.id_str, false, 'auto');
            }
          });
        } else {
          ex.App.showMsgBox('언리트윗했습니다', 'blue', 1000);
          ex.App.chkRetweet(tweet.id_str, false, 'auto');

          Client.post('statuses/unretweet/' + tweet.id_str, (error, tweet, response) => {
            if (error) {
              console.warn(error);
              ex.App.chkRetweet(tweet.id_str, true, 'auto');
            }
          });
        }
        document.activeElement.blur();
      };

      var execFavorite = () => {
        ex.App.showMsgBox('마음에 드는 트윗으로 지정했습니다', 'blue', 1000);
        if (!this.isFavorited) {
          ex.App.chkFavorite(tweet.id_str, true, 'auto');
          Client.post('favorites/create', {id: tweet.id_str}, (error, tweet, response) => {
            if (error) {
              console.warn(error);
              switch (error[0].code) {
                // already favorited
                case 139:
                  ex.App.showMsgBox('이미 마음에 드는 트윗으로 지정한 트윗입니다', 'tomato', 1000);
                  return;
                // rate limit reached
                case 88:
                  ex.App.showMessageBox('API 리밋입니다', 'tomato', 1000);
                  return;
                default:
                  ex.App.showMsgBox(`오류가 발생했습니다<br />${error[0].code}: ${error[0].message}`, 'tomato', 5000);
              }
              ex.App.chkFavorite(tweet.id_str, false, 'auto');
            }
          });
        } else {
          ex.App.showMsgBox('마음에 드는 트윗을 해제했습니다', 'blue', 1000);
          ex.App.chkFavorite(tweet.id_str, false, 'auto');

          Client.post('favorites/destroy', {id: tweet.id_str}, (error, tweet, response) => {
            if (error) {
              console.warn(error);
              // no status found
              if (error[0].code == 144)
                return;
              ex.App.chkFavorite(tweet.id_str, true, 'auto');
            }
          });
        }
        document.activeElement.blur();
      };
      
      var execDelete = () => {
        Client.post('statuses/destroy', {id: tweet.id_str}, (error, tweet, response) => {
          if (error) {
            console.warn(error);
          } else {
            ex.App.showMsgBox('해당 트윗을 삭제했습니다', 'blue', 1000);
          }
        });
      };
    }
  };

  return ex;
})();
