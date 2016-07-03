// string formatting
if(!String.prototype.format) 
{
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	}
	String.prototype.string = function(len) {
		var s = '', i = 0;
		while (i++ < len)
		{
			s += this;
		}
		return s;
	};
	String.prototype.zf = function(len) {
		return "0".string(len - this.length) + this;
	};
	Number.prototype.zf = function(len) {
		return this.toString().zf(len);
	};
}

// date formatting
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000);
            case "MM": return (d.getMonth() + 1);
            case "dd": return d.getDate();
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

var Twitter = require('twitter');
var Twitter_text = require('twitter-text');
var Util = require('util');
var OAuth = new (require('oauth').OAuth)(
	'https://api.twitter.com/oauth/request_token',
	'https://api.twitter.com/oauth/access_token',
	'',
	'',
	'1.0',
	null, // callback URL
	'HMAC-SHA1'
	);

Client = new Twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
});

var App = {
	// Kuritsu Consumer Key
	_DefaultConsumerKey: 'hFFszQ5tet93VbnD9m153Tudc',
	_DefaultConsumerSecret: 'Aub7LIPgREDs6AhzYmvEriXDugNThlxVOx2dMS0JUPfH1zgeLf',
	config: {
		ConsumerKey: '',
		ConsumerSecret: '',
		AccessToken: '',
		AccessSecret: '',

		home_timeline_noti: true,
		home_timeline_sound: true,

		debug: false
	},
	msg:
	{
		someone_retweeted: '<a href="#" onclick="openExternal(\'https://twitter.com/{0}\')">{1}</a> 님이 리트윗했습니다',
	},

	id_str: '',
	name: '',
	screen_name: '',
	tweet_count: 0,

	symbol: {
		reply: '<svg viewBox="0 0 62 72"><path d="M41 31h-9V19c0-1.14-.647-2.183-1.668-2.688-1.022-.507-2.243-.39-3.15.302l-21 16C5.438 33.18 5 34.064 5 35s.437 1.82 1.182 2.387l21 16c.533.405 1.174.613 1.82.613.453 0 .908-.103 1.33-.312C31.354 53.183 32 52.14 32 51V39h9c5.514 0 10 4.486 10 10 0 2.21 1.79 4 4 4s4-1.79 4-4c0-9.925-8.075-18-18-18z"></path></svg>',
		retweet: '<svg viewBox="0 0 74 72"><path d="M70.676 36.644C70.166 35.636 69.13 35 68 35h-7V19c0-2.21-1.79-4-4-4H34c-2.21 0-4 1.79-4 4s1.79 4 4 4h18c.552 0 .998.446 1 .998V35h-7c-1.13 0-2.165.636-2.676 1.644-.51 1.01-.412 2.22.257 3.13l11 15C55.148 55.545 56.046 56 57 56s1.855-.455 2.42-1.226l11-15c.668-.912.767-2.122.256-3.13zM40 48H22c-.54 0-.97-.427-.992-.96L21 36h7c1.13 0 2.166-.636 2.677-1.644.51-1.01.412-2.22-.257-3.13l-11-15C18.854 15.455 17.956 15 17 15s-1.854.455-2.42 1.226l-11 15c-.667.912-.767 2.122-.255 3.13C3.835 35.365 4.87 36 6 36h7l.012 16.003c.002 2.208 1.792 3.997 4 3.997h22.99c2.208 0 4-1.79 4-4s-1.792-4-4-4z"></path></svg>',
		like: '<svg viewBox="0 0 54 72"><path d="M38.723 12c-7.187 0-11.16 7.306-11.723 8.13-.563-.824-4.496-8.13-11.723-8.13C8.79 12 3.533 18.163 3.533 24.647 3.533 39.964 21.89 55.907 27 56c5.11-.093 23.467-16.036 23.467-31.353C50.467 18.163 45.21 12 38.723 12z"></path></svg>',
		home: '<svg viewBox="0 0 64 72"><path d="M60.034 33.795l-26-23.984c-1.15-1.06-2.92-1.06-4.068 0l-26 23.985c-1.218 1.123-1.294 3.02-.17 4.24 1.122 1.216 3.02 1.295 4.238.17l2.265-2.09 6.808 24.683C17.468 62.098 18.65 63 20 63h24c1.35 0 2.533-.9 2.892-2.202l6.81-24.683 2.264 2.09c.576.532 1.306.795 2.033.795.808 0 1.614-.325 2.205-.966 1.124-1.218 1.047-3.116-.17-4.24zM32 53c-1.657 0-3-1.342-3-3 0-1.656 1.343-3 3-3s3 1.344 3 3c0 1.658-1.343 3-3 3zm0-11c-3.866 0-7-3.133-7-6.998 0-3.867 3.134-7 7-7s7 3.133 7 7C39 38.867 35.866 42 32 42z"></path></svg>',
		noti: '<svg viewBox="0 0 58 72"><path d="M47.594 21.745c-1.216-2.624-3.06-4.84-5.355-6.51l.052-.153c.863-2.373-.447-5.026-2.924-5.928-2.48-.902-5.188.288-6.05 2.66l-.058.153c-.387-.027-.775-.052-1.163-.052-7.805 0-14.575 5.36-17.667 13.99-3.212 8.963-9.247 13.91-9.3 13.953-.668.532-1.076 1.325-1.124 2.178-.048.853.27 1.688.875 2.29.31.31.685.55 1.096.7l35.917 13.07c.33.12.676.182 1.026.182h.023c1.657 0 3-1.343 3-3 0-.295-.042-.58-.122-.85-.22-1.422-1.07-8.41 1.89-16.41 2.123-5.75 2.082-11.53-.116-16.273zM26.355 64.206c3.4 1.235 7.1-.08 9.02-2.96L21.35 56.137c-.38 3.444 1.607 6.83 5.007 8.068z"></path></svg>',
		dm: '<svg viewBox="0 0 58 72"><path d="M46 15H12l17 16"></path><path d="M53 16L31.07 37.17c-.578.554-1.324.83-2.07.83s-1.492-.276-2.07-.83c0 0-21.91-21.148-21.93-21.17-1.138.908-2 2-2 4v38c0 1.185.697 2.26 1.78 2.74.392.175.807.26 1.22.26.727 0 1.445-.265 2.007-.77L19 50h31c2.804 0 5-2.196 5-5V20c0-2-.862-3.09-2-4z"></path></svg>',
		search: '<svg viewBox="0 0 56 72"><path d="M51.644 53.096l-7.41-7.41c-1.067-1.067-2.525-1.488-3.914-1.294l-2.328-2.328c2.51-3.343 3.89-7.375 3.894-11.628.005-5.2-2.016-10.084-5.69-13.757-3.667-3.67-8.547-5.69-13.74-5.69-5.2 0-10.09 2.028-13.77 5.71-7.58 7.582-7.582 19.916-.005 27.494 3.673 3.67 8.553 5.693 13.744 5.693 4.257 0 8.294-1.38 11.64-3.893l2.326 2.327c-.193 1.39.227 2.848 1.295 3.916l7.41 7.41C46 60.547 47.184 61 48.37 61s2.37-.452 3.274-1.357c1.81-1.807 1.81-4.74 0-6.547zM34.94 30.44c0 6.903-5.597 12.5-12.5 12.5s-12.5-5.597-12.5-12.5 5.595-12.5 12.5-12.5 12.5 5.595 12.5 12.5z"></path><path d="M51.644 53.096l-7.41-7.41c-1.067-1.067-2.525-1.488-3.914-1.294l-2.328-2.328c2.51-3.343 3.89-7.375 3.894-11.628.005-5.2-2.016-10.084-5.69-13.757-3.667-3.67-8.547-5.69-13.74-5.69-5.2 0-10.09 2.028-13.77 5.71-7.58 7.582-7.582 19.916-.005 27.494 3.673 3.67 8.553 5.693 13.744 5.693 4.257 0 8.294-1.38 11.64-3.893l2.326 2.327c-.193 1.39.227 2.848 1.295 3.916l7.41 7.41C46 60.547 47.184 61 48.37 61s2.37-.452 3.274-1.357c1.81-1.807 1.81-4.74 0-6.547zM34.94 30.44c0 6.903-5.597 12.5-12.5 12.5s-12.5-5.597-12.5-12.5 5.595-12.5 12.5-12.5 12.5 5.595 12.5 12.5z"></path></svg>',
		write: '<svg viewBox="0 0 60 72"><path d="M54 41c-1.657 0-3 1.343-3 3v12.01h-.002c0 .536-.425.966-.957.99H31c-1.657 0-3 1.343-3 3s1.343 3 3 3h21.185C54.84 63 57 60.84 57 58.184V44c0-1.657-1.343-3-3-3zM23 12H7.817C5.16 12 3 14.16 3 16.815V41c0 1.657 1.343 3 3 3s3-1.343 3-3V19c0-.553.447-1 1-1h13c1.657 0 3-1.343 3-3s-1.343-3-3-3zM53.426 13.79C57.052 10.16 57 6.812 57 6.812c-16.24 4.542-27.973 19.82-35.81 33.266-6.047 10.34-9.532 19.844-10.257 22.096-1.315 4.043-1.316 6.577-.634 6.796.682.22 2.393-2.332 4.084-5.37 1.088-1.95 2.58-4.53 4.492-8.035 3.93-7.244 8.677-13.067 14.13-14.275.01-.002.05-.048.067-.066 4.025-.623 12.596-4.548 13.498-9.89-2.763 1.22-5.605 1.857-8.47 1.83 0 0 1.627-2.42 4.335-3.443 4.646-1.76 7.504-3.285 10.073-7.34.887-1.417 1.285-2.458 1.75-3.983-2.914 1.848-6.785 2.975-9.006 2.967 2.084-2.93 5.19-4.592 8.174-7.578z"></path></svg>',
	},

	// Load Config
	loadConfig: function(callback) {
		var jsonfile = require('jsonfile');
		jsonfile.readFile('./config.json', function(err, obj)
		{
			if(!err)
			{
				console.info('loadConfig Successed.');
				for (var attr in obj) { App.config[attr] = obj[attr]; }
				if(callback)
					callback();
			}
			else
			{
				console.warn('loadConfig Failed: \r\n' + Util.inspect(err));
				App.saveConfig(callback);
				return;
			}
		});
	},

	saveConfig: function(callback) {
		var jsonfile = require('jsonfile');
		jsonfile.spaces = 4;
		jsonfile.writeFile('./config.json', App.config, function (err)
		{
			if(!err)
			{
				console.info('saveConfig Successed.');
			}
			else
			{
				console.warn('saveConfig Failed: \r\n' + Util.inspect(err));
			}

			if(callback)
			{
				callback();
			}
		});
	},

	confirmAuth: function(msg) {
		if(!msg) var msg = 'oauth 토큰이 유효하지 않습니다. 지금 토큰을 요청할까요?\r\n' + 
				  '토큰을 요청하지 않으면 기능이 작동하지 않습니다.';
		var result = confirm(msg);
		if(result)
			App.getRequestToken(App.getConsumerKey(), App.getConsumerSecret());
	},

	confirmAuthFirst: function() {
		var msg = '발급받은 oauth 토큰이 없습니다. 지금 토큰을 요청할까요?\r\n' + 
				  '토큰을 요청하지 않으면 기능이 작동하지 않습니다.';
		return App.confirmAuth(msg);
	},

	promptPin: function() {			
		var pin;
		pin = prompt('토큰 요청후 발급받은 핀번호를 입력하세요');

		if(pin != null)
			App.getAccessToken(pin);
	},

	getConsumerKey: function() {
		if(!App.config.ConsumerKey)
			return App._DefaultConsumerKey;
		else return App.config.ConsumerKey;
	},

	getConsumerSecret: function() {
		if(!App.config.ConsumerSecret)
			return App._DefaultConsumerSecret;
		else return App.config.ConsumerSecret;
	},

	getRequestToken: function(consumerKey, consumerSecret) {
		if(!consumerKey) consumerKey = App.getConsumerKey();
		if(!consumerSecret) consumerSecret = App.getConsumerSecret();
		OAuth._consumerKey = consumerKey;
		OAuth._consumerSecret = consumerSecret;
		OAuth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
			if(error)
				console.error(error);
			else
			{
				console.log('oauth_token :' + oauth_token)
				console.log('oauth_token_secret :' + oauth_token_secret)
				console.log('requestoken results :' + Util.inspect(results))
				console.log("Requesting access token")

				OAuth._requestToken = oauth_token;

				//console.warn('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token + "\n");

				openExternal('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
				App.promptPin();
			}
		});
	},

	getAccessToken: function(pin) {
		if (!pin)
		{
			alert('핀번호를 입력해 주십시오.');
			return getAccessToken();
		}
		OAuth.getOAuthAccessToken(OAuth._requestToken, OAuth._consumerSecret, pin,
			function(err, access_token, access_secret, results)
		{
			if(err)
			{	
				switch(err.data)
				{
					case 'Error processing your OAuth request: Invalid oauth_verifier parameter':
					{
						alert('핀번호가 올바르지 않습니다.');
						getAccessToken();
					}
					break;

					case 'Invalid request token.':
						alert('만료된 인증 토큰입니다. 인증을 다시 요청하세요.');
					break;
					
					default:
						alert('인증이 실패했습니다. 잠시 후 다시 시도해 주십시오.\r\n' + err.data);
					break;
				}
				return;
			}

			alert('인증이 성공했습니다.');

			App.config.ConsumerKey = OAuth._consumerKey;
			App.config.ConsumerSecret = OAuth._consumerSecret;
			App.config.AccessToken = access_token;
			App.config.AccessSecret = access_secret;

			//OAuth.getProtectedResource("https://api.twitter.com/1/statuses/home_timeline.json", "GET", oauth_access_token, oauth_access_token_secret, function (error, data, response) {
			//	Util.puts(data);
			//});

			App.saveConfig();
			App.initializeClient(OAuth._consumerKey, OAuth._consumerSecret, access_token, access_secret);
			App.run();
		});
	
	},
	
	initializeClient: function(consumer_key, consumer_secret, access_token_key, access_token_secret) {
		Client.options.consumer_key = consumer_key;
		Client.options.consumer_secret = consumer_secret;
		Client.options.access_token_key = access_token_key;
		Client.options.access_token_secret = access_token_secret;

		Client.options.request_options.oauth.consumer_key = consumer_key;
		Client.options.request_options.oauth.consumer_secret = consumer_secret;
		Client.options.request_options.oauth.token = access_token_key;
		Client.options.request_options.oauth.token_secret = access_token_secret;
	},

	vertifyCredentials: function(callback) {
		Client.get('account/verify_credentials', function(error, event, response) {
			if(error)
			{
				console.error(error);
				return;
			}
			App.id_str = event.id_str;
			App.name = event.name;
			App.screen_name = event.screen_name;

			if(callback)
				callback(error);
		});
	},

	run: function() {
		App.loadConfig(function() {
			App.initializeClient(App.config.ConsumerKey, App.config.ConsumerSecret, App.config.AccessToken, App.config.AccessSecret);
				
			if(!App.config.AccessToken || !App.config.AccessSecret)
			{
				oauth_req.style.display = '';
				App.resizeContainer();
				return App.confirmAuthFirst();
			}

			App.vertifyCredentials(function(error) {
				if(error)
				{
					oauth_req.style.display = '';
					App.resizeContainer();

					return App.confirmAuth();
				}
				else
				{
					oauth_req.style.display = 'none';
					App.resizeContainer();
					App.execStream();
					//getAboutme();
					//getTimeline();
				}
			});
		});
	},
		
	execStream: function()
	{
		Client.stream('user', 'include_followings_activity: true', function(stream) {
			stream.on('data', function(tweet) {
				if(tweet.text)
				{
					App.addItem(home_timeline, new Tweet(tweet));
//					addTweet(home_timeline, tweet);

					// debug flag
					if(App.config.debug)
						console.log(tweet);
					
					// 리트윗시 원문이 노티로 가게
					if(tweet.retweeted_status)
						tweet = tweet.retweeted_status;

					App.execStream.sequence = (App.execStream.sequence + 1) % 3;
					
					// alert noti
					if(App.config.home_timeline_noti)
					{
						// Notification 요청
						if (window.Notification)
						Notification.requestPermission();

						var noti = new Notification(tweet.user.name,
							{tag: App.execStream.sequence, body: tweet.text, icon: tweet.user.profile_image_url_https});

						// 노티를 클릭하면 창 닫기
						noti.onclick = function () {
							noti.close();
						};
						
						// 노티 타임아웃 처리
						noti.onshow = function() {
							setTimeout(function() { noti.close() }, 3000);
						};
					}

					// alert sound
					if(App.config.home_timeline_sound)
						document.getElementById('update-sound').play();
				}
				else if (tweet.delete)
				{
					var target = document.querySelector('[data-tweet-id="' + tweet.delete.status.id_str + '"]');
					if(target)
						target.classList.add('deleted');
				}
				else
				{
					console.log(tweet);
				}
			});
			stream.on('error', function(error) {
				console.error(error);
			});
		});
	},

	execRetweet: function(e)
	{
		Element = document.querySelector('[data-retweet="' + e + '"]');
		countElement = document.querySelector('[data-retweet-count="' + e + '"]');
		if(!Element.classList.contains('retweeted'))
		{
			App.showMsgBox("리트윗했습니다", "msgbox_blue", 1000);
			Element.classList.add('retweeted');
			countElement.innerText++;
			Client.post('statuses/retweet/' + e, function(error, tweet, response) {
				if (error) {
					Element.classList.remove('retweeted');
					if(countElement.innerText == "1")
						countElement.innerText = "";
					else
						countElement.innerText--;
				}
			});
		}
		else
		{
			App.showMsgBox("언리트윗했습니다", "msgbox_blue", 1000);
			Element.classList.remove('retweeted');
			if(countElement.innerText == "1")
				countElement.innerText = "";
			else
				countElement.innerText--;

			Client.post('statuses/unretweet/' + e, function(error, tweet, response) {
				if (error) {
					Element.classList.add('retweeted');
					countElement.innerText++;
				}
			});
			
		}
		console.log(e);	
	},

	execFavorite: function(e)
	{	
		App.showMsgBox("마음에 드는 트윗으로 지정했습니다", "msgbox_blue", 1000);
		Element = document.querySelector('[data-favorite="' + e + '"]');
		countElement = document.querySelector('[data-favorite-count="' + e + '"]');
		if(!Element.classList.contains('favorited'))
		{
			Element.classList.add('favorited');
			countElement.innerText++;
			Client.post('favorites/create', {id: e}, function(error, tweet, response) {
				if (error) {
					Element.classList.remove('favorited');
					if(countElement.innerText == "1")
						countElement.innerText = "";
					else
						countElement.innerText--;
				}
				});
			
		}
		else
		{	
			App.showMsgBox("마음에 드는 트윗을 해제했습니다", "msgbox_blue", 1000);
			Element.classList.remove('favorited');
			if(countElement.innerText == "1")
				countElement.innerText = "";
			else
				countElement.innerText--;

			Client.post('favorites/destroy', {id: e}, function(error, tweet, response) {
				if (error) {
					Element.classList.add('favorited');
					countElement.innerText++;
				}
			});
			
		}
		console.log(e);
	},

	showMsgBox: function(a, b, c)
	{
		if(!c)
		{
			c = b;
			b = 'msgbox_blue';
		}

		msgbox.innerHTML = a;
		msgbox.className = b;
		msgbox.setAttribute('timestamp', new Date().getTime());
		App.resizeContainer();

		if(c)
		{
			var timestamp = msgbox.getAttribute('timestamp');
			setTimeout(function(id)
			{
				if(msgbox.getAttribute('timestamp') == timestamp)
				{
					msgbox.classList.add('hidden');	
					App.resizeContainer();
				}
			}, c);
		}
	},

	resizeContainer: function()
	{
		container.style.height = 'calc(100% - ' + toolbox.getClientRects()[0].height + 'px)';
	},

	execTweet: function()
	{
		writebox.hidden = true;
		App.resizeContainer();
		var param = {status: tweetbox.value};
		if(in_reply_to_status_id.value) param.in_reply_to_status_id = in_reply_to_status_id.value;

		Client.post('statuses/update', param, function(error, event, response) {
			if (!error) {
				App.showMsgBox("트윗했습니다", "msgbox_blue", 3000);
			}
			else {
				App.showMsgBox("오류가 발생했습니다<br />" + error[0].code + ": " + error[0].message, "msgbox_tomato", 5000);
			}
		});
	},

	tryReply: function(id)
	{		
		writebox.hidden = false;
		App.resizeContainer();
//		var usernames = Twitter_text.extractMentions("Mentioning @twitter and @jack")
		tweetbox.value = '';
		var usernames = [];
		
		usernames.push(document.querySelector('[data-tweet-text="' + id + '"]').getAttribute('data-tweet-name'));
		Array.from(Twitter_text.extractMentions(document.querySelector('[data-tweet-text="' + id + '"]').innerText)).
			forEach(function(name) {
				usernames.push(name);
		});

		Array.from(usernames).forEach(function(name) {
			if(name != App.screen_name)
				tweetbox.value += '@' + name + ' ';
		});

		in_reply_to_status_id.value = id;
		tweetlen.innerHTML = 140 - tweetbox.value.length;
		tweetbox.focus();
	},

	getTimeline: function()
	{ 
		Client.get('https://api.twitter.com/1.1/statuses/home_timeline', {since_id: App.getTimeline.since_id}, function(error, event, response){
			if(!error) {
				Array.from(event).forEach(function(item) {
					console.log(item);
					App.getTimeline.since_id = item.id_str;
				});
			}
			else
			{
				console.log(error);
			}
		});
	},

	getAboutme: function()
	{ 
		Client.get('https://api.twitter.com/i/activity/about_me', {cards_platform:'Web-12', include_cards:'1', model_version:'7', count: 600, since_id:App.getAboutme.max_position}, function(error, event, response){
			if (!error) {
				if(event.length)
				{
					App.getAboutme.max_position = event[0].max_position;
				}
				for (var i = event.length - 1; i >= 0; i--)
				{
					addActivity(notification, event[i]);

					// debug flag
					if(App.config.debug)
						console.log(event[i]);
				}
			}
			else
			{
				console.warn(error);
			}
			//setTimeout(getAboutme, 3000);
		});
	},
	addItem: function(t, e)
	{
		var tl = t.firstElementChild;

		// 유저가 스크롤바를 잡고 있을때는 추가되는 트윗을 감춤.
		// onmouseup 이벤트 발생시 트윗들을 다시 꺼냄
		if (window.scrolling)
		{
			document.getElementById('new_tweet_noti').hidden = false;
			e.element.classList.add('hidden');
		}
		tl.insertBefore(e.element, tl.firstElementChild);
		
		if(!window.scrolling)
		{
			// scrollbar 이동
			if (t.scrollTop)
			{
				t.scrollTop += tl.firstElementChild.getClientRects()[0].height + 10;
			}
		}

	},
	removeItem: function(t, target) {
		if(typeof target == "number")
			target = document.querySelector('[data-item-id="' + target + '"]');
		t.firstElementChild.removeChild(target);
	},
	removeItems: function(timeline, count) {
		var i = 0;
		Array.from(timeline.firstElementChild.children).forEach(function(item) {
			if(i >= count)
			{
				//console.log(i + ": deleted");
				item.remove();
			}
			i++;
		});
	},
}

// Static variable
App.getTimeline.since_id = '1';
App.getAboutme.max_position = 0;
App.execStream.sequence = 0;

function Test(event) {
	a = document.createElement('article');
	a.className = 'tweet';
	//a.setAttribute('data-tweet-id', tweet.id_str);
	//a.setAttribute('data-tweet-timestamp', tweet.timestamp_ms);
	a.innerHTML = 'TESTTEST';
	this.element = a;
}

function Activity(event) {
	a = document.createElement('article');
	a.className = 'tweet';
	a.innerHTML = "";
	var tweet_div = 'action: {0}, sources.0.name: {1}';
	a.innerHTML += tweet_div.format(event.action, event.sources[0].name);
					 //<!--<input type="button" value="-" onclick="removeRow(this.parentNode)">//-->
	this.element = a;
}

function Tweet(tweet) {
	a = document.createElement('article');
	a.className = 'tweet';
	a.setAttribute('data-tweet-id', tweet.id_str);
	a.setAttribute('data-tweet-timestamp', tweet.timestamp_ms);
	a.innerHTML = "";

	// retweeted / favorited
	var retweeted = "";
	var favorited = "";
	if (tweet.favorited)
		favorited = "favorited";
	if (tweet.retweeted || tweet.retweeted_status && tweet.user.id_str == App.id_str)
		retweeted = "retweeted";

	id_str_org = tweet.id_str;

	if(tweet.retweeted_status)
	{
		a.innerHTML += '<div class="retweeted_tweet">' + App.symbol.retweet + '<span class="retweeted_tweet_text">&nbsp;' + App.msg.someone_retweeted.format(tweet.user.screen_name, tweet.user.name) + '</span></div>\r\n';
		tweet = tweet.retweeted_status;
	}

	text = urlify(tweet.text);
	text = text.replace(/(\r\n|\n|\r)/gm, '<br>');

	var tweet_div = '<img class="profile-image" src={0}></img>\r\n' +
					'<div class="tweet-name"><a href="#" onclick="openPopup(\'https://twitter.com/{1}\')">\r\n' +
					'<strong>{2}</strong>\r\n' +
					'<span class="tweet-id">@{1}</span></a></div>\r\n' +
					'<p data-tweet-text="{3}" data-tweet-name="{4}" class="tweet-text">{5}</p>';

	a.innerHTML += tweet_div.format(tweet.user.profile_image_url_https, tweet.user.screen_name, tweet.user.name, id_str_org, tweet.user.screen_name, text);
					 //<!--<input type="button" value="-" onclick="removeRow(this.parentNode)">//-->
	
	if(tweet.entities.media)
	{
		a.innerHTML += '<div class="tweet-image"><img src="' + tweet.entities.media[0].media_url_https + '" /></div>';
	}


	a.innerHTML += '<div class="tweet-date"><a href="#" onclick="openPopup(\'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str + '\')">' + new Date(Date.parse(tweet.created_at)).format("a/p hh:mm - yyyy년 MM월 dd일") + '</a> · ' + tagRemove(tweet.source) + '</div>';
	if (!tweet.retweet_count)
		tweet.retweet_count = "";
	if (!tweet.favorite_count)
		tweet.favorite_count = "";
	
	a.innerHTML += '<div aria-label="트윗 작업" role="group" class="tweet-task">' + 
					 '<div class="tweet-task-box"><button aria-label="답글" data-testid="reply" type="button" onclick="App.tryReply(\'' + id_str_org + '\')">' + 
					 '<span>' + App.symbol.reply + '</span></button></div><div class="tweet-task-box ' + retweeted + '" data-retweet="' + id_str_org + '"><button aria-label="리트윗 1회. 리트윗" data-testid="retweet" type="button" onclick="App.execRetweet(\'' + id_str_org + '\')"><span class="tweet-task-count">' + App.symbol.retweet + '&nbsp;<span><span data-retweet-count="' + id_str_org + '">' + tweet.retweet_count + '</span></span></span></button></div><div class="tweet-task-box ' + favorited + '" data-favorite="' + id_str_org + '"><button aria-label="마음에 들어요" data-testid="like" type="button" onclick="App.execFavorite(\'' + id_str_org + '\')"><span>' + App.symbol.like + '&nbsp;<span class="tweet-task-count"><span data-favorite-count="' + id_str_org + '">' + tweet.favorite_count + '</span></span></span></button></div></div>';
	this.element = a;
}

window.onload = function(e) {
	// tweetbox onchange event
	tweetbox.addEventListener('input', function() {
		tweetlen.innerHTML = 140 - tweetbox.value.length;

	}, false);

	tweetbox.addEventListener('onpropertychange', function() {
		tweetlen.innerHTML = 140 - tweetbox.value.length;

	}, false);

	// scrollbar hack
	home_timeline.onmousedown = function() {
		window.scrolling = true;
	};
	home_timeline.firstElementChild.onmousedown = function(f) {
		window.scrolling = false;
		f.stopPropagation();
	};
	home_timeline.onmouseup = function() {
		window.scrolling = false;
		for (var i = 1; i < this.firstElementChild.childNodes.length-1; i++)
		{
			if(this.firstElementChild.childNodes[i].className != undefined &&
			this.firstElementChild.childNodes[i].classList.contains('hidden'))
			{
				new_tweet_noti.hidden = true;
				this.firstElementChild.childNodes[i].classList.remove('hidden');
				if (this.scrollTop)
					this.scrollTop += this.firstElementChild.childNodes[i].getClientRects()[0].height + 10;
				
			}
		}
	};
	
	header.innerHTML = '<span class="navigator selected"><a href="#" onclick="naviSelect(0)">' + App.symbol.home + '</a></div>';
	header.innerHTML += '<span class="navigator"><a href="#" onclick="naviSelect(1)">' + App.symbol.noti + '</a></div>';
	header.innerHTML += '<span class="navigator"><a href="#" onclick="naviSelect(2)">' + App.symbol.dm + '</a></div>';
	header.innerHTML += '<span class="navigator"><a href="#" onclick="naviSelect(3)">' + App.symbol.search + '</a></div>';
	header.innerHTML += '<span class="navigator"><a href="#" onclick="naviSelect(4)">' + App.symbol.write + '</a></div>';

	// run Application
	App.run();
};

var KEY = {
	NUMBER_1: 49,
	NUMBER_2: 50,
	NUMBER_3: 51,
	T: 84,
	ESC: 27,
    WASD_LEFT:  65,
    WASD_RIGHT: 68,
    WASD_UP:    87,
    WASD_DOWN:  83
}

document.onkeydown = function (e) {
	if(document.activeElement == tweetbox)
	{
		switch (e.keyCode) {
			case KEY.ESC:
				naviSelect(4);
			return false;
		}
	}
	else
	{
		switch (e.keyCode) {
			case KEY.NUMBER_1:
				naviSelect(0);
				break;
			case KEY.NUMBER_2:
				naviSelect(1);
				break;
			case KEY.NUMBER_3:
				naviSelect(2);
				break;
			case KEY.T:	
				if(writebox.hidden)
					naviSelect(4);
				else tweetbox.focus();
				return false;
			
			/*
			case KEY.WASD_LEFT:
				alert('Left');
				break;
			case KEY.WASD_RIGHT:
				alert('Right');
				break;
			case KEY.WASD_UP:
				alert('Up');
				break;
			case KEY.WASD_DOWN:
				alert('Down');
				break;
	*/
			default:
				return; // exit this handler for other keys
		}
    }
};
function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}
function naviSelect(e)
{
	if(e > 2 || header.children[e].classList.contains('selected'))
	{
		switch(e)
		{
			case 0:
			{
				scrollTo(home_timeline, 0, 200);
			}
			break;
			case 1:
			{
				scrollTo(notification, 0, 200);
			}
			break;
			case 2:
			{
				scrollTo(direct_message, 0, 200);
			}
			break;
			case 4:
			{
				if(writebox.hidden)
					writebox.hidden = false;
				else
					writebox.hidden = true;

				tweetbox.value = "";
				in_reply_to_status_id.value = "";
				tweetlen.innerText = '140';
				tweetbox.focus();
				App.resizeContainer();
			}
		}
	}
	else
	{
		for (var i = 0; i < container.childElementCount; i++)
		{
			if (i != e)
			{
				container.children[i].classList.add('hidden');
				header.children[i].classList.remove('selected');
			}
			else
			{
				container.children[i].classList.remove('hidden');
				header.children[i].classList.add('selected');
			}
		}
	}
}
