const sortLastMessage = (a,b) =>{
    const aTimestamp = a.message[0]?.timestamp || 0
    const bTimestamp = b.message[0]?.timestamp || 0
    return bTimestamp - aTimestamp
}
const combinedData = (friendAvatar, sortLastMessage) =>{
    return friendAvatar.map((friend) =>{
        const lastMessageData = sortLastMessage.find((chat) => chat.chatters.includes(friend.name))
        return {
            ...friend,
            lastMessage: lastMessageData ? lastMessageData.message : "",
        }
    })
}

export {sortLastMessage,combinedData};