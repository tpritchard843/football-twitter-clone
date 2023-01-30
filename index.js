import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    
    else if(e.target.dataset.tweetreply){
        replyToTweetClick(e.target.dataset.tweetreply)
    }
    
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    
    else if(e.target.dataset.trash){
        deleteTweet(e.target.dataset.trash)
        //console.log(e.target.dataset.trash)
    }
})


 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    document.getElementById(`${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Titi14 🐐`,
            profilePic: `images/thierry-henry.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    tweetInput.value = ''
    
    render()
    
    }
    //console.log(tweetsData)
}
//event listener to look for clicks on 


function replyToTweetClick(tweetId) {
    const replyToTweet = document.getElementById(`tweet-reply-${tweetId}`)
    
    let tweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(replyToTweet.value){
        tweetObj.replies.unshift({
            handle: `@Titi14 🐐`,
            profilePic: `images/thierry-henry.jpg`,
            tweetText: replyToTweet.value
        })
        
        replyToTweet.value = ''
        
        render()
        handleReplyClick(tweetId)
    }
}


function deleteTweet(tweetId){
    let index = tweetsData.findIndex(tweet => tweet.uuid === tweetId)
    tweetsData.splice(index, 1)

    render()
    console.log(tweetsData)
    
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i id="delete-tweet" class="fa-solid fa-trash"
                    data-trash="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>
    
    <div class="tweet-reply hidden" id="${tweet.uuid}">
        <img src="images/tommypickles.jpg" class="profile-pic-reply">
        <input type="text" placeholder="Reply to tweet" id="tweet-reply-${tweet.uuid}">
        <button class="reply-tweet-btn" id="reply-tweet-btn" data-tweetreply="${tweet.uuid}">Tweet</button>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

