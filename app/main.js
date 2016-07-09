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

var symbol = {
	reply: '<svg viewBox="0 0 62 72"><path d="M41 31h-9V19c0-1.14-.647-2.183-1.668-2.688-1.022-.507-2.243-.39-3.15.302l-21 16C5.438 33.18 5 34.064 5 35s.437 1.82 1.182 2.387l21 16c.533.405 1.174.613 1.82.613.453 0 .908-.103 1.33-.312C31.354 53.183 32 52.14 32 51V39h9c5.514 0 10 4.486 10 10 0 2.21 1.79 4 4 4s4-1.79 4-4c0-9.925-8.075-18-18-18z"></path></svg>',
	retweet: '<svg viewBox="0 0 74 72"><path d="M70.676 36.644C70.166 35.636 69.13 35 68 35h-7V19c0-2.21-1.79-4-4-4H34c-2.21 0-4 1.79-4 4s1.79 4 4 4h18c.552 0 .998.446 1 .998V35h-7c-1.13 0-2.165.636-2.676 1.644-.51 1.01-.412 2.22.257 3.13l11 15C55.148 55.545 56.046 56 57 56s1.855-.455 2.42-1.226l11-15c.668-.912.767-2.122.256-3.13zM40 48H22c-.54 0-.97-.427-.992-.96L21 36h7c1.13 0 2.166-.636 2.677-1.644.51-1.01.412-2.22-.257-3.13l-11-15C18.854 15.455 17.956 15 17 15s-1.854.455-2.42 1.226l-11 15c-.667.912-.767 2.122-.255 3.13C3.835 35.365 4.87 36 6 36h7l.012 16.003c.002 2.208 1.792 3.997 4 3.997h22.99c2.208 0 4-1.79 4-4s-1.792-4-4-4z"></path></svg>',
	like: '<svg viewBox="0 0 54 72"><path d="M38.723 12c-7.187 0-11.16 7.306-11.723 8.13-.563-.824-4.496-8.13-11.723-8.13C8.79 12 3.533 18.163 3.533 24.647 3.533 39.964 21.89 55.907 27 56c5.11-.093 23.467-16.036 23.467-31.353C50.467 18.163 45.21 12 38.723 12z"></path></svg>',
	home: '<svg viewBox="0 0 64 72"><path d="M60.034 33.795l-26-23.984c-1.15-1.06-2.92-1.06-4.068 0l-26 23.985c-1.218 1.123-1.294 3.02-.17 4.24 1.122 1.216 3.02 1.295 4.238.17l2.265-2.09 6.808 24.683C17.468 62.098 18.65 63 20 63h24c1.35 0 2.533-.9 2.892-2.202l6.81-24.683 2.264 2.09c.576.532 1.306.795 2.033.795.808 0 1.614-.325 2.205-.966 1.124-1.218 1.047-3.116-.17-4.24zM32 53c-1.657 0-3-1.342-3-3 0-1.656 1.343-3 3-3s3 1.344 3 3c0 1.658-1.343 3-3 3zm0-11c-3.866 0-7-3.133-7-6.998 0-3.867 3.134-7 7-7s7 3.133 7 7C39 38.867 35.866 42 32 42z"></path></svg>',
	noti: '<svg viewBox="0 0 58 72"><path d="M47.594 21.745c-1.216-2.624-3.06-4.84-5.355-6.51l.052-.153c.863-2.373-.447-5.026-2.924-5.928-2.48-.902-5.188.288-6.05 2.66l-.058.153c-.387-.027-.775-.052-1.163-.052-7.805 0-14.575 5.36-17.667 13.99-3.212 8.963-9.247 13.91-9.3 13.953-.668.532-1.076 1.325-1.124 2.178-.048.853.27 1.688.875 2.29.31.31.685.55 1.096.7l35.917 13.07c.33.12.676.182 1.026.182h.023c1.657 0 3-1.343 3-3 0-.295-.042-.58-.122-.85-.22-1.422-1.07-8.41 1.89-16.41 2.123-5.75 2.082-11.53-.116-16.273zM26.355 64.206c3.4 1.235 7.1-.08 9.02-2.96L21.35 56.137c-.38 3.444 1.607 6.83 5.007 8.068z"></path></svg>',
	dm: '<svg viewBox="0 0 58 72"><path d="M46 15H12l17 16"></path><path d="M53 16L31.07 37.17c-.578.554-1.324.83-2.07.83s-1.492-.276-2.07-.83c0 0-21.91-21.148-21.93-21.17-1.138.908-2 2-2 4v38c0 1.185.697 2.26 1.78 2.74.392.175.807.26 1.22.26.727 0 1.445-.265 2.007-.77L19 50h31c2.804 0 5-2.196 5-5V20c0-2-.862-3.09-2-4z"></path></svg>',
	search: '<svg viewBox="0 0 56 72"><path d="M51.644 53.096l-7.41-7.41c-1.067-1.067-2.525-1.488-3.914-1.294l-2.328-2.328c2.51-3.343 3.89-7.375 3.894-11.628.005-5.2-2.016-10.084-5.69-13.757-3.667-3.67-8.547-5.69-13.74-5.69-5.2 0-10.09 2.028-13.77 5.71-7.58 7.582-7.582 19.916-.005 27.494 3.673 3.67 8.553 5.693 13.744 5.693 4.257 0 8.294-1.38 11.64-3.893l2.326 2.327c-.193 1.39.227 2.848 1.295 3.916l7.41 7.41C46 60.547 47.184 61 48.37 61s2.37-.452 3.274-1.357c1.81-1.807 1.81-4.74 0-6.547zM34.94 30.44c0 6.903-5.597 12.5-12.5 12.5s-12.5-5.597-12.5-12.5 5.595-12.5 12.5-12.5 12.5 5.595 12.5 12.5z"></path><path d="M51.644 53.096l-7.41-7.41c-1.067-1.067-2.525-1.488-3.914-1.294l-2.328-2.328c2.51-3.343 3.89-7.375 3.894-11.628.005-5.2-2.016-10.084-5.69-13.757-3.667-3.67-8.547-5.69-13.74-5.69-5.2 0-10.09 2.028-13.77 5.71-7.58 7.582-7.582 19.916-.005 27.494 3.673 3.67 8.553 5.693 13.744 5.693 4.257 0 8.294-1.38 11.64-3.893l2.326 2.327c-.193 1.39.227 2.848 1.295 3.916l7.41 7.41C46 60.547 47.184 61 48.37 61s2.37-.452 3.274-1.357c1.81-1.807 1.81-4.74 0-6.547zM34.94 30.44c0 6.903-5.597 12.5-12.5 12.5s-12.5-5.597-12.5-12.5 5.595-12.5 12.5-12.5 12.5 5.595 12.5 12.5z"></path></svg>',
	write: '<svg viewBox="0 0 60 72"><path d="M54 41c-1.657 0-3 1.343-3 3v12.01h-.002c0 .536-.425.966-.957.99H31c-1.657 0-3 1.343-3 3s1.343 3 3 3h21.185C54.84 63 57 60.84 57 58.184V44c0-1.657-1.343-3-3-3zM23 12H7.817C5.16 12 3 14.16 3 16.815V41c0 1.657 1.343 3 3 3s3-1.343 3-3V19c0-.553.447-1 1-1h13c1.657 0 3-1.343 3-3s-1.343-3-3-3zM53.426 13.79C57.052 10.16 57 6.812 57 6.812c-16.24 4.542-27.973 19.82-35.81 33.266-6.047 10.34-9.532 19.844-10.257 22.096-1.315 4.043-1.316 6.577-.634 6.796.682.22 2.393-2.332 4.084-5.37 1.088-1.95 2.58-4.53 4.492-8.035 3.93-7.244 8.677-13.067 14.13-14.275.01-.002.05-.048.067-.066 4.025-.623 12.596-4.548 13.498-9.89-2.763 1.22-5.605 1.857-8.47 1.83 0 0 1.627-2.42 4.335-3.443 4.646-1.76 7.504-3.285 10.073-7.34.887-1.417 1.285-2.458 1.75-3.983-2.914 1.848-6.785 2.975-9.006 2.967 2.084-2.93 5.19-4.592 8.174-7.578z"></path></svg>',
	activity: '<svg viewBox="0 0 72 72"><path transform="scale(0.04,-0.037) translate(0,-1900)" d="M1480 880h180q39 0 69.5 -31t30.5 -69t-30.5 -69t-69.5 -31h-141l-283 -462q-8 -23 -30 -40t-47 -17q-7 -1 -15 -1q-22 0 -40 9q-36 18 -48 55l-16 16q0 35 6 43l-128 984l-181 -512q-2 -7 -5 -13q-11 -28 -35 -45t-51 -17h-1h-391q-41 0 -67.5 27.5t-26.5 72.5 t27.5 72.5t72.5 27.5h323l289 818q7 19 33.5 40.5t54.5 21.5l31 -3q2 -1 0 -2q26 3 36 -9.5t12 -36.5q10 -14 15 -29l150 -1153l180 295l5 6q22 52 91 52z"></path></svg>',
	close: '<svg width="20" height="20"><g style="stroke-width:3px;stroke:#777"><line x1="3" y1="3" x2="17" y2="17"/><line x1="3" y1="17" x2="17" y2="3"/></g></svg>',
	settings: '<svg viewBox="0 0 72 120"><path transform="scale(0.04,-0.037) translate(0,-1900)" d="M1554 870l159 -102q17 -3 27 -10.5t14 -22t5 -25t1 -30.5v-7t-1 -12.5t-2.5 -13.5t-4.5 -4l-18 -42q-16 -38 -55 -54q1 13 -39 -27v4t-1.5 8.5t-3.5 9.5t-6.5 5t-11.5 -5l-170 42q-48 -71 -114 -122l38 -176l-11 -6q0 -20 -1 -31t-5 -27t-15 -28.5t-29 -23.5l-43 -17 l-27 7q-20 0 -30.5 0.5t-25.5 3.5t-25 10.5t-16 19.5l-86 142q-55 -16 -97 -16q-36 0 -80 11l-92 -144q-19 -29 -46 -39q-10 5 -15.5 -2t-5.5 -16l-1 -10q-13 0 -23 6t-14 12.5t-9.5 10t-9.5 -0.5l-43 18q-8 13 -24 24t-26.5 22t-10.5 28q0 40 2 43l41 168q-69 50 -121 117 l-176 -39l-26 -9q-28 0 -55 22.5t-35 47.5l-17 43q-10 5 -11.5 11t-1.5 36q0 17 10 28t24 22.5t20 26.5l149 91q-3 30 -3 72q0 46 6 91l-159 101q-17 3 -27 10.5t-14 22t-5 25t-1 30.5v7t1 12.5t2.5 13t4.5 3.5l18 43q11 32 38 56.5t56 24.5l23 -22l170 -42q49 71 115 123 l-39 175l11 6q0 20 1 31t5 27t15 28.5t29 23.5l43 17l27 -7q20 0 30.5 -0.5t25.5 -3.5t25 -10.5t16 -19.5l86 -142q55 16 97 16q36 0 80 -11l92 144l68 67q13 0 23 -6t14 -12.5t9.5 -10.5t10.5 1l43 -18q8 -13 23.5 -24t26 -22t10.5 -28q0 -40 -2 -43l-41 -168 q69 -50 121 -117l176 39l26 9q28 0 55 -22.5t35 -47.5l17 -43q10 -5 11.5 -11t1.5 -36q0 -17 -10 -28t-24 -22.5t-20 -26.5l-149 -91q3 -30 3 -72q0 -45 -6 -90zM802 569q10 -2 72.5 -25.5t85.5 -23.5t82.5 22t68.5 24l4 1q119 53 182 160t63 233q0 27 -1 42t-7 40t-18 49 q-30 75 -86 131.5t-130 88.5q-10 2 -72.5 25.5t-85.5 23.5t-82.5 -22t-68.5 -24q-122 -53 -185.5 -160.5t-63.5 -233.5q0 -27 1 -42t7 -40t18 -49q30 -75 86 -131.5t130 -88.5z"></path></svg>'
}

Client = new Twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
});

var Stream;

var App = {
	// Kuritsu Consumer Key
	_DefaultConsumerKey: 'hFFszQ5tet93VbnD9m153Tudc',
	_DefaultConsumerSecret: 'Aub7LIPgREDs6AhzYmvEriXDugNThlxVOx2dMS0JUPfH1zgeLf',
	config: {
		ConsumerKey: '',
		ConsumerSecret: '',
		AccessToken: '',
		AccessSecret: '',
		
		runStream: true,
		enableHomeTLNoti: false,
		enableHomeTLSound: false,
		enableMentionTLNoti: true,
		enableMentionTLSound: true,
		hideMyRetweets: true,
		magicScroll: false,
		magicScrollSensitivity: 250,
		/**/

		debug: false
	},

	id_str: '',
	name: '',
	screen_name: '',
	tweet_count: 0,

	tweetUploader: new TweetUploader(),
	mediaUploader: new MediaSelector(),

	// Load Config
	loadConfig: callback => {
		var jsonfile = require('jsonfile');
		jsonfile.readFile('./config.json', (err, obj) => {
			if(!err)
			{
				console.info('loadConfig Successed.');
				for (var attr in obj) { App.config[attr] = obj[attr]; }
				if(callback)
					callback();
			}
			else
			{
				console.warn(`loadConfig Failed: \r\n${Util.inspect(err)}`);
				App.saveConfig(callback);
				return;
			}
		});
	},

	saveConfig: callback => {
		var jsonfile = require('jsonfile');
		jsonfile.spaces = 4;
		jsonfile.writeFile('./config.json', App.config, (err) => {
			if(!err) console.info('saveConfig Successed.');
			else console.warn(`saveConfig Failed: \r\n${Util.inspect(err)}`);

			if(callback) callback();
		});
	},

	confirmAuth: msg => {
		if(!msg) var msg = 'oauth 토큰이 유효하지 않습니다. 지금 토큰을 요청할까요?\r\n' + 
				  '토큰을 요청하지 않으면 기능이 작동하지 않습니다.';
		var result = confirm(msg);
		if(result) App.getRequestToken(App.getConsumerKey(), App.getConsumerSecret());
	},

	confirmAuthFirst: () => {
		var msg = '발급받은 oauth 토큰이 없습니다. 지금 토큰을 요청할까요?\r\n' + 
				  '토큰을 요청하지 않으면 기능이 작동하지 않습니다.';
		return App.confirmAuth(msg);
	},

	promptPin: () => {			
		var pin;
		pin = prompt('토큰 요청후 발급받은 핀번호를 입력하세요');

		if(pin != null)
			App.getAccessToken(pin);
	},

	getConsumerKey: () => {
		if(!App.config.ConsumerKey)
			return App._DefaultConsumerKey;
		else return App.config.ConsumerKey;
	},

	getConsumerSecret: () => {
		if(!App.config.ConsumerSecret)
			return App._DefaultConsumerSecret;
		else return App.config.ConsumerSecret;
	},

	getRequestToken: (consumerKey, consumerSecret) => {
		if(!consumerKey) consumerKey = App.getConsumerKey();
		if(!consumerSecret) consumerSecret = App.getConsumerSecret();
		OAuth._consumerKey = consumerKey;
		OAuth._consumerSecret = consumerSecret;
		OAuth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
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

	getAccessToken: pin => {
		if (!pin)
		{
			alert('핀번호를 입력해 주십시오.');
			return getAccessToken();
		}
		OAuth.getOAuthAccessToken(OAuth._requestToken, OAuth._consumerSecret, pin,
			(err, access_token, access_secret, results) => {
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
	
	initializeClient: (consumer_key, consumer_secret, access_token_key, access_token_secret) => {
		Client.options.consumer_key = consumer_key;
		Client.options.consumer_secret = consumer_secret;
		Client.options.access_token_key = access_token_key;
		Client.options.access_token_secret = access_token_secret;

		Client.options.request_options.oauth.consumer_key = consumer_key;
		Client.options.request_options.oauth.consumer_secret = consumer_secret;
		Client.options.request_options.oauth.token = access_token_key;
		Client.options.request_options.oauth.token_secret = access_token_secret;
	},

	vertifyCredentials: (callback) => {
		Client.get('account/verify_credentials', (error, event, response) => {
			if(error)
			{
				// retry vertifyCredentials if limit
				if (error.code == 'ENOTFOUND')
				{
					App.showMsgBox("인터넷 또는 서버가 불안정합니다. 자동으로 서버에 접속을 시도합니다", "tomato", 3000);
					return setTimeout(() => App.vertifyCredentials(callback), 1000);
				}
				else if(error[0].code == 88)
				{
					App.showMsgBox("API 리밋으로 연결이 지연되고 있습니다. 잠시만 기다려 주세요", "tomato", 12000);
					return setTimeout(() => App.vertifyCredentials(callback), 10000);
				}
				else
				{
					App.showMsgBox("알 수 없는 문제로 연결이 지연되고 있습니다. 잠시만 기다려 주세요", "tomato", 12000);
					return setTimeout(() => App.vertifyCredentials(callback), 10000);
				}
			}
			else
			{
				App.clearMsgBox();
				App.id_str = event.id_str;
				App.name = event.name;
				App.screen_name = event.screen_name;
			}

			if(callback)
				callback(error);
		});
	},

	getLimitStatus: () => {
		Client.get('application/rate_limit_status', (error, event, response) => {
			if(error)
			{
				console.error(error);
			}
			else
			{
				console.log(event);
			}
		});
	},

	chkConnect: () => {
		var timestamp = new Date().getTime();
		Client.get('https://api.twitter.com/1/', (error, event, response) => {
			if(App.chkConnect.event_timestamp > timestamp) return;
			App.chkConnect.event_timestamp = timestamp;

			if(App.config.runStream && !Client.mainStreamRunning && !App.chkConnect.iserror)
			{
				App.chkConnect.iserror = true;
				App.alertConnect(false);
			}

			else if(error.code)
			{
				if(!App.chkConnect.iserror)
				{
					App.chkConnect.iserror = true;
					App.alertConnect(false);
					
					if(App.config.runStream)
						App.stopMainStream();
				}
			}
			else
			{
				if(App.chkConnect.iserror)
				{
					App.chkConnect.iserror = false;
					App.alertConnect(true);

					if(App.config.runStream)
						App.runMainStream();
				}
			}
		});

		setTimeout(App.chkConnect, 5000);
	},

	runMainStream: () => {
		if(Client.mainStream)
			Client.mainStream.destroy();

		App.alertConnect(true);

		Client.stream('user', 'include_followings_activity: true', (stream) => {
			Client.mainStream = stream;
			Client.mainStreamRunning = true;
			App.alertStream(true);
			App.alertConnect(true);
			App.chkConnect();
			stream.on('data', (tweet) => {
				if(tweet.text)
				{
					// 자기 자신의 리트윗은 스트리밍에서 막음
					if(App.config.hideMyRetweets && tweet.retweeted_status && tweet.user.id_str == App.id_str)
						return;

					App.addItem(home_timeline, new Tweet(tweet));
//					addTweet(home_timeline, tweet);

					// debug flag
					if(App.config.debug)
						console.log(tweet);
					
					// 리트윗된 트윗이 아닐때 멘션되었으면 멘션창으로 이동시킴
					var copy_mention = false;
					if(!tweet.retweeted_status)
						for (var name of Twitter_text.extractMentions(tweet.text))
							if (name == App.screen_name) copy_mention = true;
					if(copy_mention)
						App.addItem(notification, new Tweet(tweet));
					
					// 리트윗시 원문이 노티로 가게
					if(tweet.retweeted_status)
						tweet = tweet.retweeted_status;

					App.runMainStream.sequence = (App.runMainStream.sequence + 1) % 3;
					
					// alert noti
					if(App.config.enableHomeTLNoti)
					{
						// Notification 요청
						if (window.Notification)
						Notification.requestPermission();

						var noti = new Notification(tweet.user.name,
							{tag: App.runMainStream.sequence, body: tweet.text, icon: tweet.user.profile_image_url_https});

						// 노티를 클릭하면 창 닫기
						noti.onclick = () => noti.close();
						
						// 노티 타임아웃 처리
						noti.onshow = () => setTimeout(() => noti.close(), 3000);
					}

					// alert sound
					if(App.config.enableHomeTLSound)
						document.getElementById('update-sound').play();
				}
				else if (tweet.delete)
				{
					var target = document.querySelector(`[data-tweet-id="${tweet.delete.status.id_str}"]`);
					if(target)
						target.classList.add('deleted');
				}
				else
				{
					console.log(tweet);
				}
			});
			stream.on('error', error => console.error(error));
			stream.on('end', response => {
				console.warn(response);
				Client.mainStream = '';
				Client.mainStreamRunning = false;
			});
		});
	},

	stopMainStream: () => {
		Client.mainStreamRunning = false;
		Client.mainStream.destroy();
	},

	alertStream: e => {
		stream_off.style = (e ? 'display: none' : '');
		App.resizeContainer();
	},

	alertConnect: e => {
		conn_error.style = (e ? 'display: none' : '');
		App.resizeContainer();
	},

	execRetweet: e => {
		Element = document.querySelector(`[data-retweet="${e}"]`);
		countElement = document.querySelector(`[data-retweet-count="${e}"]`);
		if(!Element.classList.contains('retweeted'))
		{
			App.showMsgBox("리트윗했습니다", "blue", 1000);
			App.chkRetweet(e, true, 'auto');
			Client.post(`statuses/retweet/${e}`, (error, tweet, response) => {
				if (error) {
					console.warn(error);
					// already retweeted
					if(error[0].code == 327)
					{
						App.showMsgBox("이미 리트윗한 트윗입니다", "tomato", 1000);
						return;
					}

					App.showMsgBox(`오류가 발생했습니다<br />${error[0].code}: ${error[0].message}`, "tomato", 5000);
					App.chkRetweet(e, false, 'auto');
				}
				else
				{
					/*if(tweet.retweeted_status)
						tweet = tweet.retweeted_status;
					
					App.chkRetweet(e, true, tweet.retweet_count);
					App.chkFavorite(e, true, tweet.favorite_count);*/
				}
			});
		}
		else
		{
			App.showMsgBox("언리트윗했습니다", "blue", 1000);
			App.chkRetweet(e, false, 'auto');

			Client.post('statuses/unretweet/' + e, (error, tweet, response) => {
				if (error) {
					console.warn(error);
					App.chkRetweet(e, true, 'auto');
				}
				else
				{
					/*if(tweet.retweeted_status)
						tweet = tweet.retweeted_status;
					
					App.chkRetweet(e, false, tweet.retweet_count);
					App.chkFavorite(e, false, tweet.favorite_count);*/
				}
			});
		}
		document.activeElement.blur();
	},

	execFavorite: e => {	
		App.showMsgBox("마음에 드는 트윗으로 지정했습니다", "blue", 1000);
		Element = document.querySelector(`[data-favorite="${e}"]`);
		countElement = document.querySelector(`[data-favorite-count="${e}"]`);
		if(!Element.classList.contains('favorited'))
		{
			App.chkFavorite(e, true, 'auto');
			Client.post('favorites/create', {id: e}, (error, tweet, response) => {
				if (error) {
					console.warn(error);
					// already favorited
					if(error[0].code == 139)
					{
						App.showMsgBox("이미 마음에 드는 트윗으로 지정한 트윗입니다", "tomato", 1000);
						return;
					}

					App.showMsgBox(`오류가 발생했습니다<br />${error[0].code}: ${error[0].message}`, "tomato", 5000);
					App.chkFavorite(e, false, 'auto');
				}
				else
				{	
					/*if(tweet.retweeted_status)
						tweet = tweet.retweeted_status;
					
					App.chkRetweet(e, true, tweet.retweet_count);
					App.chkFavorite(e, true, tweet.favorite_count);*/
				}
			});
		}
		else
		{	
			App.showMsgBox("마음에 드는 트윗을 해제했습니다", "blue", 1000);
			App.chkFavorite(e, false, 'auto');

			Client.post('favorites/destroy', {id: e}, (error, tweet, response) => {
				if (error) {
					console.warn(error);
					// no status found
					if(error[0].code == 144)
						return;

					App.chkFavorite(e, true, 'auto');
				}
				else
				{	
					/*if(tweet.retweeted_status)
						tweet = tweet.retweeted_status;
					
					App.chkRetweet(e, false, tweet.retweet_count);
					App.chkFavorite(e, false, tweet.favorite_count);*/
				}
			});
			
		}
		document.activeElement.blur();
	},

	isRetweeted: e => {
		arr = Array.from(document.querySelectorAll('[data-retweet="' + e + '"]'));
		if(arr.length && arr[arr.length - 1])
		{
			if(arr[arr.length - 1].classList.contains('retweeted'))
			{
				return true;
			}
		}
		return false;
	},

	chkRetweet: (e, check, count) => {
		Array.from(document.querySelectorAll(`[data-retweet="${e}"]`)).forEach(item => {
			countElement = document.querySelector(`[data-retweet-count="${e}"]`);
			if(typeof(count) != 'undefined' && typeof(count) != 'string')
				if(count)
					countElement.innerText = count;
				else
					countElement.innerText = "";
			
			if (check)
			{
				item.classList.add('retweeted');
				if(count == 'auto')
					countElement.innerText++;
			}
			else
			{
				item.classList.remove('retweeted');
				if(count == 'auto')
					countElement.innerText = (countElement.innerText == "1" ?
					"" : countElement.innerText--);
			}
		});
	},

	isFavorited: e => {
		arr = Array.from(document.querySelectorAll(`[data-favorite="${e}"]`));
		if(arr.length && arr[arr.length - 1])
		{
			if(arr[arr.length - 1].classList.contains('favorited'))
			{
				return true;
			}
		}
		return false;
	},

	chkFavorite: (e, check, count) => {
		Array.from(document.querySelectorAll(`[data-favorite="${e}"]`)).forEach(item => {
			countElement = document.querySelector(`[data-favorite-count="${e}"]`);
			if(typeof(count) != 'undefined' && typeof(count) != 'string')
				if(count)
					countElement.innerText = count;
				else
					countElement.innerText = "";
			
			if (check)
			{
				item.classList.add('favorited');
				if(count == 'auto')
					countElement.innerText++;
			}
			else
			{
				item.classList.remove('favorited');
				if(count == 'auto')
					countElement.innerText = (countElement.innerText == "1" ?
					"" : countElement.innerText--);
			}
		});
	},

	showMsgBox: (a, b, c) => {
		/* 2-argument: 
		 *   a: message, b: duration (default color is blue)
		 * 3-argument:
		 *   a: message, b: color, c: duration (in msec) */
		if(!c)
		{
			c = b;
			b = 'blue';
		}

		msgbox.innerHTML = a;
		msgbox.className = 'msgbox ' + b;
		msgbox.setAttribute('timestamp', new Date().getTime());
		App.resizeContainer();

		if(c)
		{
			var timestamp = msgbox.getAttribute('timestamp');
			setTimeout(id => {
				if(msgbox.getAttribute('timestamp') == timestamp)
					App.clearMsgBox();
			}, c);
		}
	},

	clearMsgBox: () => {
		msgbox.classList.add('hidden');	
		App.resizeContainer();
	},

	resizeContainer: () => {
		container.style.height = 'calc(100% - ' + toolbox.getClientRects()[0].height + 'px)';
		App.procOffscreen();
	},

	openSettings: () => {
		var w = 450;
		var h = 365;
		var left = (screen.width/2)-(w/2);
		var top = (screen.height/2)-(h/2);
		if(window.setting) nw.Window.get(window.popup).focus();
		nw.Window.open('app/settings.html', {width: w, height: h, id: 'setting'}, 
		win => {
			win.window.config = App.config;
			win.window.App = App;
			win.id = 'setting';
			win.width = w;
			win.height = h;
			win.x = Math.round(left);
			win.y = Math.round(top);
			
			win.focus();
	  });
	},

	procOffscreen: () => {
		for (var item of home_timeline.firstElementChild.children)
			if (isOffscreen(item)) {
				if (item.firstElementChild.style.display != 'none') {
					item.style.height = (item.firstElementChild.getClientRects()[0].height + 10) + 'px';
					item.firstElementChild.style.display = 'none';
				}
			} else {
				item.style.height = '';
				item.firstElementChild.style.display = 'block';
			}
	},

	procScrollEmphasize:e => {
		if(!e.scrollTop)
			e.classList.add('scrolltop');
		else
			e.classList.remove('scrolltop');
	},

	tryReply: id => {	
		App.tweetUploader.openPanel();
		var usernames = [],
			target = document.querySelector(`article[data-tweet-id="${id}"]`),
			obj = JSON.parse(target.getAttribute('data-json'));
			tweet_author = obj['user_screen_name'];
		if (tweet_author != App.screen_name) usernames.push(tweet_author);
		for (var name of Twitter_text.extractMentions(obj.text))
			if (name != tweet_author && name != App.screen_name)
				usernames.push(name);

		App.tweetUploader.text = usernames.map(x => '@' + x).join(' ') + ' ';
		App.tweetUploader.inReplyTo = {id: id, name: obj['user_name'], screen_name: tweet_author, text: obj['text']};
	},

	getTimeline: () => { 
		Client.get('https://api.twitter.com/1.1/statuses/home_timeline', {since_id: App.getTimeline.since_id|""}, (error, event, response) => {
			if (!error) for (var item of event.reverse()) {
				App.addItem(home_timeline, new Tweet(item));
				App.getTimeline.since_id = item.id_str;
			}
			else console.error(error);
		});
	},

	getTweetItem: e => {
		Client.get(`https://api.twitter.com/1.1/statuses/show/${e}`, {}, (error, event, response) => {
			if(!error)
			{
				App.addItem(home_timeline, new Tweet(event));
			}
			else console.error(error);
		});
	},

	getMentionsTimeline: () => {
		Client.get('statuses/mentions_timeline', {since_id: App.getMentionsTimeline.since_id|""}, (error, event, response) => {
			if(!error) for (var item of event.reverse()) {
				App.addItem(notification, new Tweet(item));
				App.getMentionsTimeline.since_id = item.id_str;
			}
			else console.log(event);
		});
	},

	getAboutme: () => { 
		Client.get('https://api.twitter.com/i/activity/about_me', {cards_platform:'Web-12', include_cards:'1', model_version:'7', count: 600, since_id:App.getAboutme.max_position}, (error, event, response) => {
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
	addItem: (t, e) => {
		var tl = t.firstElementChild;

		// 100개가 넘어가면 90개만 남기고 나머지를 비운다
		if(tl.childElementCount > 200)
			App.removeItems(t, 190);

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

		App.procOffscreen();
	},
	removeItem: (t, target) => {
		if(typeof target == "number")
			target = document.querySelector(`[data-item-id="${target}"]`);
		t.firstElementChild.removeChild(target);
	},
	removeItems: (timeline, count) => {
		var i = 0;
		Array.from(timeline.firstElementChild.children).forEach(item => {
			if(i >= count)
			{
				//console.log(i + ": deleted");
				item.remove();
			}
			i++;
		});
	},

	run: () => {
		App.loadConfig(() => {
			App.initializeClient(App.config.ConsumerKey, App.config.ConsumerSecret, App.config.AccessToken, App.config.AccessSecret);
				
			if(!App.config.AccessToken || !App.config.AccessSecret)
			{
				oauth_req.style.display = '';
				App.resizeContainer();
				return App.confirmAuthFirst();
			}

			App.vertifyCredentials(error => {
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
					App.getTimeline();
					App.getTweetItem('751494319601754112');
					App.getMentionsTimeline();
					if(App.config.runStream)
						App.runMainStream();
					else
					{
						App.alertStream(false);
					}
					//getAboutme();
				}
			});
		});
	},
}

// Static variable
App.chkConnect.iserror = false;
App.chkConnect.event_timestamp = 0;
App.getTimeline.since_id = '1';
App.getMentionsTimeline.since_id = '1';
App.getAboutme.max_position = 0;
App.runMainStream.sequence = 0;

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

function tag(strings, ...values)
{
	for(s in strings)
	{
		console.log(s);
	}
}
function Tweet(tweet, quoted) {
	var a = document.createElement('article');
	var className = quoted ? 'tweet quoted' : 'tweet';
	a.className = 'tweet_wrapper';
	a.setAttribute('data-tweet-id', tweet.id_str);
	a.setAttribute('data-tweet-timestamp', tweet.timestamp_ms);

	var mentioned_me = false;
	if(!tweet.retweeted_status)
		for (var name of Twitter_text.extractMentions(tweet.text))
			if (name == App.screen_name) mentioned_me = true;
	if (mentioned_me) className += ' tweet_emp blue';

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
		a.innerHTML += `<div class="retweeted_tweet">${symbol.retweet}<span class="retweeted_tweet_text">&nbsp;
						<a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${tweet.user.screen_name}')">${tweet.user.name}</a> 님이 리트윗했습니다</span></div>`
		tweet = tweet.retweeted_status;
	}

	var embed = {
		id_str: tweet.id_str,
		user_name: tweet.user.name,
		user_screen_name: tweet.user.screen_name,
		text: tweet.text
	};
	a.setAttribute('data-json', JSON.stringify(embed));
	text = urlify(tweet.text);
	text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
	text = twemoji.parse(text)
	
	a.innerHTML += `<img class="profile-image" src=${tweet.user.profile_image_url_https}></img>
					<div class="tweet-name"><a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${tweet.user.screen_name}')">
					<strong>${tweet.user.name}</strong>
					<span class="tweet-id">@${tweet.user.screen_name}</span></a></div>
					<p class="tweet-text lpad">${text}</p>`;
	
	var entities = tweet.extended_entities || tweet.entities || null;
	if(entities.media)
	{
		var container = document.createElement('div');
		var urls = entities.media.map(function(x){return x.media_url_https;});
		var urlstr = urls.join(';');
		container.setAttribute('data-media-count', entities.media.length);
		container.className = 'tweet-media-container';
		for (var i in urls)
			container.innerHTML += `<div class="tweet-image"><a href="javascript:void(0)" onclick="openImageview('${urls[i]}', '${urlstr}')"><img src="${urls[i]}"/></a></div>`;
		a.appendChild(container);
	}

	var quoted_status = tweet.quoted_status || null;
	if (!quoted && quoted_status)
	{
		var twt = new Tweet(quoted_status, true)
		a.appendChild(twt.element);
	}

	a.innerHTML += `
		<div class="tweet-date lpad">
		<a href="javascript:void(0)" onclick="openPopup('https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}')">
		${new Date(Date.parse(tweet.created_at)).format("a/p hh:mm - yyyy년 MM월 dd일")}
		</a> · ${tagRemove(tweet.source)}</div>`;
	if (!tweet.retweet_count)
		tweet.retweet_count = "";
	if (!tweet.favorite_count)
		tweet.favorite_count = "";

	if (!quoted)
		a.innerHTML += `<div aria-label="트윗 작업" role="group" class="tweet-task lpad">
					 <div class="tweet-task-box"><button aria-label="답글" data-testid="reply" type="button" onclick="App.tryReply('${id_str_org}')">
					 <span>${symbol.reply}</span></button></div><div class="tweet-task-box ${retweeted}" data-retweet="${id_str_org}"><button aria-label="리트윗" data-testid="retweet" type="button" onclick="App.execRetweet('${id_str_org}')">
					 <span class="tweet-task-count">${symbol.retweet}&nbsp;<span><span data-retweet-count="${id_str_org}">${tweet.retweet_count}</span></span></span></button>
					 </div><div class="tweet-task-box ${favorited}" data-favorite="${id_str_org}"><button aria-label="마음에 들어요" data-testid="like" type="button" onclick="App.execFavorite('${id_str_org}')"><span>${symbol.like}&nbsp;
					 <span class="tweet-task-count"><span data-favorite-count="${id_str_org}">${tweet.favorite_count}</span></span></span></button></div></div>`;

	a.innerHTML = `<div class="${className}">${a.innerHTML}</div>`;
	this.element = a;
}

function TweetUploader() {
	this.mediaSelector = new MediaSelector();

	var _isOpen = false;
	var _inReplyTo = '';
	var e = document.createElement('div'),
		replyInfo = document.createElement('div');
		txt = document.createElement('textarea'),
		btnContainer = document.createElement('div'),
		closeButton = document.createElement('div'),
		lenIndicator = document.createElement('span'),
		postButton = document.createElement('input');
	
	/*initElement*/ { 
		e.className = 'writebox';
		e.hidden = true;
		replyInfo.className = 'reply-info';
		txt.rows = 4;
		btnContainer.className = 'buttons';
		postButton.className = 'bluebutton';
		postButton.type = 'button';
		postButton.value = '트윗하기';

		closeButton.appendChild((() => {
			var a = document.createElement('a');
			a.href = 'javascript:void(0)';
			a.innerHTML = symbol.close;
			a.addEventListener('click', e => this.closePanel());
			return a;
		})());
		btnContainer.appendChild(closeButton);
		btnContainer.appendChild(this.mediaSelector.element);
		btnContainer.appendChild((() => {
			var div = document.createElement('div');
			div.appendChild(lenIndicator);
			div.appendChild(postButton);
			return div;
		})());
		e.appendChild(replyInfo);
		e.appendChild(txt);
		e.appendChild(btnContainer);

		var txtChanged = e => (lenIndicator.innerHTML = 140 - txt.value.length);
		txt.addEventListener('input', txtChanged);
		txt.addEventListener('keydown', e => {
			switch (e.keyCode) {
				case 16: break;
				case KEY.ENTER:
					if (!e.shiftKey) execTweet();
					break;
				case KEY.ESC:
					this.closePanel();
					return false;
			}
		}, false);
		postButton.addEventListener('click', e => execTweet());
	}

	var execTweet = () => {
		this.closePanel();

		if (this.mediaSelector.selectedFiles.length != 0)
		{
			var path = this.mediaSelector.selectedFiles;
			var files = [];
			App.showMsgBox('트윗을 올리는 중입니다', 'orange', 30000);
			for (var i in path)
				(index => {
					var data = require('fs').readFileSync(path[index]);
					Client.post('media/upload', {media: data}, (error, media, response) => {
						if (!error) {
							console.log(media);
							files[index] = media;
							// make sure all fies are successfully uploaded.
							if (files.filter(f => f !== undefined).length === path.length)
								return _ex(files.map(x => x.media_id_string).join(','));
						}
						else return App.showMsgBox(`오류가 발생했습니다<br />${error[0].code}: ${error[0].message}`, "tomato", 5000);
					});
				})(i);
		}
		else return _ex();

		function _ex(media_ids)
		{
			var param = {status: txt.value};
			if (media_ids) param.media_ids = media_ids;

			if(_inReplyTo != '') param.in_reply_to_status_id = _inReplyTo;

			Client.post('statuses/update', param, (error, event, response) => {
				if (!error) {
					App.showMsgBox("트윗했습니다", "blue", 3000);
				}
				else {
					App.showMsgBox(`오류가 발생했습니다<br />${error[0].code}: ${error[0].message}`, "tomato", 5000);
				}
			});
		}
	}

	this.element = e;

	this.openPanel = () => {
		_isOpen = true;
		this.inReplyTo = '';
		this.mediaSelector.reset();
		replyInfo.hidden = true;
		e.hidden = false;
		lenIndicator.innerHTML = '140';
		txt.value = '';
		txt.focus();
		App.resizeContainer();
	};

	this.closePanel = () => {
		_isOpen = false;
		e.hidden = true;
		App.resizeContainer();
	}

	this.focus = () => txt.focus();
	
	Object.defineProperties(this, {
		"isOpen": {
			"get": () => _isOpen
		},
		"text": {
			"get": () => txt.value,
			"set": (val) => {
				txt.value = val;
				lenIndicator.innerHTML = 140 - txt.value.length;
			}
		},
		"inReplyTo": {
			"get": () => _inReplyTo,
			"set": (obj) => {
				_inReplyTo = obj.id;
				replyInfo.hidden = false;
				replyInfo.innerHTML = `<div class="name">${obj.name} 님에게 보내는 답글</div><div class="orig-text">@${obj.screen_name}: ${obj.text}</div>`;
			}
		}
	});
}

function MediaSelector() {
	var e = document.createElement('div'),
		thumbContainer = document.createElement('div'),
		fileInputContainer = document.createElement('div'),
		fileInput = document.createElement('input');
	
	e.className = 'media-uploader';
	thumbContainer.className = 'thumbnails';
	thumbContainer.style.fontSize = '0';
	fileInputContainer.className = 'bluebutton';
	fileInputContainer.setAttribute('style', 'position:relative;overflow:hidden;');
	fileInput.type = 'file';
	fileInput.accept = '.png,.jpg,.gif,.mp4';
	fileInput.setAttribute('style', 'position:absolute;top:0;left:0;font-size:999px;opacity:0;');

	fileInputContainer.innerHTML += '<span>파일 추가</span>';
	fileInputContainer.appendChild(fileInput);
	e.appendChild(thumbContainer);
	e.appendChild(fileInputContainer);

	fileInput.onchange = e => {
		this.addFile(fileInput.value);
		fileInput.value = '';
		if (this.selectedFiles.length == 4)
		{
			fileInput.disabled = true;
			fileInputContainer.classList.add('disabled');
		}
	};

	this.element = e;
	this.selectedFiles = [];

	this.addFile = path => {
		if (this.selectedFiles.indexOf(path) != -1)
		{
			App.showMsgBox('같은 파일을 중복으로 선택할 수 없습니다.', 'tomato', 3000);
			return;
		}
		if (this.selectedFiles.length == 0)
			App.showMsgBox('썸네일을 클릭하면 이미지를 삭제할 수 있습니다.', 'blue', 3000);
		thumbContainer.appendChild((() => {
			var e = document.createElement('div');
			e.className = 'thumbnail';
			e.setAttribute('data-media', path);
			e.style.backgroundImage = `url('${path.replace(/\\/g, '/')}')`;
			e.addEventListener('click', (e) => {
				var path = e.target.getAttribute('data-media'),
					idx = this.selectedFiles.indexOf(path);
				this.selectedFiles.splice(idx, 1);
				e.target.outerHTML = '';
				fileInput.disabled = false;
				fileInputContainer.classList.remove('disabled');

				console.log(this.selectedFiles);
			})
			return e;
		})());
		this.selectedFiles.push(path);
	};

	this.reset = () => {
		fileInput.value = '';
		fileInput.disabled = false;
		fileInputContainer.classList.remove('disabled');
		thumbContainer.innerHTML = '';
		this.selectedFiles = [];
	};
}

window.onload = e => {
	// scrollbar hack
	home_timeline.onmousedown = () => {
		window.scrolling = true;
	};
	home_timeline.firstElementChild.onmousedown = f => {
		window.scrolling = false;
		f.stopPropagation();
	};
	home_timeline.onmouseup = e => {
		var that = e.currentTarget;
		window.scrolling = false;
		for (var i = 1; i < that.firstElementChild.childNodes.length-1; i++)
		{
			if(that.firstElementChild.childNodes[i].className != undefined &&
			that.firstElementChild.childNodes[i].classList.contains('hidden'))
			{
				new_tweet_noti.hidden = true;
				that.firstElementChild.childNodes[i].classList.remove('hidden');
				if (that.scrollTop)
					that.scrollTop += that.firstElementChild.childNodes[i].getClientRects()[0].height + 10;
				
			}
		}
	};

	home_timeline.onscroll = () =>
	{
		App.procScrollEmphasize(home_timeline);
		
		// offscreen process
		App.procOffscreen();

		// magic scroll 100px padding
		if(App.config.magicScroll)
		{
			if(home_timeline.scrollTop < 100)
			home_timeline.style.paddingTop = home_timeline.scrollTop + 'px';
		}
		else
		{
			home_timeline.style.paddingTop = '0px';
		}
		
	}

	notification.onscroll = () =>
	{
		App.procScrollEmphasize(notification);
	}


	window.onresize = () => App.procOffscreen();
	
	window.magicScroll = false;
	home_timeline.onwheel = e => {
		if(!App.config.magicScroll)
			return;

		var tl = e.currentTarget,
			dy = e.deltaY;
		
		if (magicScroll && dy > 0) return false;
		else if (tl.scrollTop == 0 && dy > 0)
		{
			magicScroll = true;
			setTimeout(() => {window.magicScroll = false;}, 250);
			tl.style.paddingTop = `${dy}px`;
			tl.scrollTop = dy;
			return false;
		}
		else if (dy < 0 && tl.style.paddingTop != '0px')
		{
			tl.scrollTop += dy;
			tl.style.paddingTop = 0;
		}
	}
	
	header_navi.innerHTML += `<span class="navigator selected"><a href="javascript:void(0)" onclick="naviSelect(0)">${symbol.home}</a></div>`;
	header_navi.innerHTML += `<span class="navigator"><a href="javascript:void(0)" onclick="naviSelect(1)">${symbol.noti}</a></div>`;
	header_navi.innerHTML += `<span class="navigator"><a href="javascript:void(0)" onclick="naviSelect(2)">${symbol.dm}</a></div>`;
	header_navi.innerHTML += `<span class="navigator"><a href="javascript:void(0)" onclick="naviSelect(3)">${symbol.search}</a></div>`;
	header_navi.innerHTML += `<span class="navigator"><a href="javascript:void(0)" onclick="naviSelect(4)">${symbol.write}</a></div>`;
	header_navi.innerHTML += `<div id="page_indicator"></div>`;
	header_setting.innerHTML = `<a href="javascript:void(0)" onclick="App.openSettings()">${symbol.settings}</a>`;

	toolbox.appendChild(App.tweetUploader.element);

	//chooseFile('#fileDialog');
	// run Application
	App.run();
};

var KEY = {
	NUMBER_1: 49,
	NUMBER_2: 50,
	NUMBER_3: 51,
	N: 78,
	ENTER: 13,
	ESC: 27,
    WASD_LEFT:  65,
    WASD_RIGHT: 68,
    WASD_UP:    87,
    WASD_DOWN:  83
}

document.onkeydown = e => {
	var isShift;
	if(window.event) {
		key = window.event.keyCode;
		isShift = !!window.event.shiftKey;
	} else {
		key = e.which;
		isShift = !!e.shiftKey;
	}

	if (document.activeElement.type != 'textarea')
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
			case KEY.N:	
				if(!App.tweetUploader.isOpen)
					naviSelect(4);
				else App.tweetUploader.focus();
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

    setTimeout(() => {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}
function naviSelect(e)
{
	if(e > 2 || header_navi.children[e].classList.contains('selected'))
	{
		switch(e)
		{
			case 0:
			{
				home_timeline.style.paddingTop = '0';
				scrollTo(home_timeline, 0, 200);
				document.activeElement.blur();
			}
			break;
			case 1:
			{
				scrollTo(notification, 0, 200);
				document.activeElement.blur();
			}
			break;
			case 2:
			{
				scrollTo(direct_message, 0, 200);
				document.activeElement.blur();
			}
			break;
			case 4:
			{
				var uploader = App.tweetUploader;
				if (uploader.isOpen)
					uploader.closePanel();
				else
					uploader.openPanel();
			}
		}
	}
	else
	{
		switch(e)
		{
			case 0:
				header_text.innerHTML = '홈 타임라인';
			break;
			case 1:
				header_text.innerHTML = '알림';
			break;
			case 2:
				header_text.innerHTML = '쪽지';
			break;
		}
		for (var i = 0; i < container.childElementCount; i++)
			header_navi.children[i].classList.remove('selected');
		header_navi.children[e].classList.add('selected');

		page_indicator.style.left = (e * 20) + '%';
		container.style.left = (e * (-100)) + 'vw';
	}	
}
function chooseFile(name) {
    var chooser = document.querySelector(name);
    chooser.addEventListener("change", evt => console.log(this.value), false);

    chooser.click();  
 }