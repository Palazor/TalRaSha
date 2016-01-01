
var Storage = {

    getCurrentUser: function () {
        return cc.sys.localStorage.getItem('curUser');
    },

    setCurrentUser: function (user) {
        cc.sys.localStorage.setItem('curUser', user);
        return true;
    },

    getScoreboard: function () {
        return cc.sys.localStorage.getItem('scoreboard') || [
                {'score': 1000, 'user': 'user1'},
                {'score': 900, 'user': 'user2'},
                {'score': 800, 'user': 'user3'},
                {'score': 600, 'user': 'user4'}
            ];
    },

    pushToScoreboard: function (user, score) {
        var scores = this.getScoreboard();
        scores.push({'score': score, 'user': user});
        scores.sort(function (a, b) {
            if (!a.hasOwnProperty('score')) {
                return 1;
            } else if (!b.hasOwnProperty('score')) {
                return -1;
            } else {
                return b['score'] - a['score'];
            }
        });
        this.setScoreboard(scores);
    },

    setScoreboard: function (scoreboard) {
        cc.sys.localStorage.setItem('scoreboard', scoreboard);
    },

    getCurrentScore: function () {
        var score = cc.sys.localStorage.getItem("score") || 0;
        return parseInt(score);
    },

    setCurrentScore: function (score) {
        cc.sys.localStorage.setItem("score", score);
        return true;
    }
};

