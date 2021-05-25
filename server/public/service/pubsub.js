const topics = {};
let subUid = -1;
export class PubSub {
    static subscribe(topic, func) {
        if (!topics[topic]) {
            topics[topic] = [];
        }
        let token = (++subUid).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    }
    
    static publish(topic, args) {
        if (!topics[topic]) {
            return false;
        }
        setTimeout(function() {
            const subscribers = topics[topic],
                len = subscribers ? subscribers.length : 0;
    
            while (len--) {
                subscribers[len].func(topic, args);
            }
        }, 0);
        return true;
    
    }
    
    static unsubscribe(token) {
        for (let m in topics) {
            if (topics[m]) {
                for (let i = 0, j = topics[m].length; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    }
}