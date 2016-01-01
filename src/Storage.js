
var Storage = {

    getCurrentUser: function () {
        return cc.sys.localStorage.getItem('curUser');
    },

    setCurrentUser: function (user) {
        cc.sys.localStorage.setItem('curUser', user);
        return true;
    },

    getScoreboard: function () {
        return JSON.parse(cc.sys.localStorage.getItem('scoreboard')) || [];
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
        cc.sys.localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
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

