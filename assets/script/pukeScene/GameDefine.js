module.exports =  {
    GAME_OUTPUT_CARD : "game_outtput_card",
    puke_card_nums : 54,
    puke_per_card_nums : 17,

    TYPE_NOT_VALID : 0,         // 不合法
    TYPE_SINGLE : 1,            // 单张
    TYPE_DOUBLE : 2,            // 一对
    TYPE_TRIPPLE : 3,           // 三个一样的
    TYPE_BOMB : 4,              // 炸弹(四张)
    TYPE_TRIPPLE_CARRY : 5,     // 三带一或者三带二
    TYPE_FOUR_CARRY : 6,        // 四带二
    TYPE_SERIAL : 7,            // 顺子
    TYPE_SERIAL_DOUBLE : 8,     // 连对
    TYPE_SERIAL_TRIPPLE : 9,    // 连三个
    TYPE_PLANE : 10,            // 飞机
    TYPE_KING_BOMB: 11,         // 王炸

    START_SET_HOST: 'start_set_host',
    ON_SELECT_POINT: 'choose_point',
    ON_SELECT_NEXT: 'on_select_next',
    MAIN_GAME_START: 'main_game_start',
    ON_GAME_NEXT: 'on_game_next',
    ON_NEXT_PUSH_CARD: 'on_next_push_card',
    GAME_OVER: 'game_over',
}