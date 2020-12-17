/**
 * %%%%%%%%%%%%%%%%%
 * %%% TIME-UTIL %%%
 * %%%%%%%%%%%%%%%%%
*/
const pastTimeByMinutes = (t) => {
    let time = new Date()
    time.setMinutes(time.getMinutes() - t)

    return time
}

module.exports = {
    pastTimeByMinutes,
}