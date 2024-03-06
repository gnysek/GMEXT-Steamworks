// FUNCTIONS

/**
 * @func steam_create_leaderboard
 * @desc With this function you can create a new leaderboard for your game. The first argument is a string which defines the name of your leaderboard, and this name should be used in any further function calls relating to the leaderboard being created. You can then define the sort order (see ${constant.LeaderboardSortOrder} constants) as well as the way in which the information is displayed (see ${constant.LeaderboardDisplayType} constants).
 * 
 * [[NOTE: If you have previously created a leaderboard with the same name (either through code or through your Steam page for the game), then this function will not create a new one.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are creating
 * @param {constant.LeaderboardSortOrder} sort_order The method for sorting the leaderboard entries
 * @param {constant.LeaderboardDisplayType} display_type The way to display the leaderboard to the user
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} id The asynchronous request ID
 * @member {string} event_type The string value `"create_leaderboard"`
 * @member {real} status The status code, `0` if the leaderboard was created and `1` if it already existed
 * @member {string} lb_name The name of the leaderboard
 * @event_end
 * 
 * @example
 * ```gml
 * steam_create_leaderboard("Game Times", lb_sort_ascending, lb_disp_time_sec);
 * ```
 * The above code will create a leaderboard called "Game Times", and set it to display the results in ascending order and with a display in seconds.
 * @func_end
 */

/**
 * @func steam_upload_score
 * @desc This function will send a score to the given leaderboard. The score to be uploaded is a real number, and the leaderboard name is a string that was defined when you created the leaderboard using the function ${function.steam_create_leaderboard}. 
 * 
 * [[NOTE: If the function call fails for any reason it will return -1 and the Async event will not be triggered.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are uploading the scores to
 * @param {real} score The score to upload
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} post_id The asynchronous request ID
 * @member {string} event_type The string value `"leaderboard_upload"`
 * @member {string} lb_name The name of the leaderboard
 * @member {real} num_entries The number of returned entries
 * @member {boolean} success Whether or not the request was successful
 * @member {boolean} updated Whether or not the leaderboard was updated (i.e.: the new score was better)
 * @member {real} score The score that was posted to the leaderboard
 * @event_end
 * 
 * @example
 * In this example, we first upload a score and then parse the `async_load` map returned if successful. The code below shows a typical example for uploading:
 * 
 * ```gml
 * if (hp <= 0)
 * {
 *     upload_ID = steam_upload_score("Game Scores", score);
 *     if (!upload_ID)
 *     {
 *         alarm[0] = game_get_speed(gamespeed_fps);
 *     }
 * }
 * ```
 * Note that we have set an alarm if the call fails. This would be used to try the upload again at a later time and you can add extra code there to retry the upload or to save the score to a text file should it continue to fail, etc. We now add the following into the ${event.steam} for the instance controlling the scores:
 * 
 * ```gml
 * var _type = ds_map_find_value(async_load, "event_type");
 * if (_type == "leaderboard_upload")
 * {
 *     var _lb_ID = ds_map_find_value(async_load, "post_id");
 *     if _lb_ID == upload_ID
 *     {
 *         var _lb_name = ds_map_find_value(async_load, "lb_name");
 *         var _lb_done = ds_map_find_value(async_load, "success");
 *         var _lb_score = ds_map_find_value(async_load, "score");
 *         var _lb_updated = ds_map_find_value(async_load, "updated");
 *         show_debug_message("leaderboard post ID:" + string(_lb_ID) + " to lb:" + string(_lb_name) + " with score:" + string(_lb_score) + " updated=" + string(_lb_updated));
 *         if (_lb_done)
 *         {
 *             show_debug_message("- Succeeded");
 *         }
 *         else
 *         {
 *             show_debug_message("- Failed");
 *         }
 *     }
 * }
 * ```
 * In the example we are simply outputting the return values to the compiler window as debug messages, but you can use this event to deal with the information in any way you choose.
 * @func_end
 */

/**
 * @func steam_upload_score_ext
 * @desc This function will send a score to the given leaderboard. It is similar to the function ${function.steam_upload_score} but has an extra argument that will allow you to force the update of the score, as by default Steam only updates the score if it is better than the previous one.
 * 
 * [[NOTE: If the function call fails for any reason it will return -1 and the Async event will not be triggered.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are uploading the scores to
 * @param {real} score The score to upload
 * @param {boolean} force_update Whether or not the value should be replaced
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} post_id The asynchronous request ID
 * @member {string} event_type The string value `"leaderboard_upload"`
 * @member {string} lb_name The name of the leaderboard
 * @member {real} num_entries The number of returned entries
 * @member {boolean} success Whether or not the request was successful
 * @member {boolean} updated Whether or not the leaderboard was updated (i.e.: the new score was better or `forceUpdate` was set to `true`)
 * @member {real} score The score that was posted to the leaderboard
 * @event_end
 * 
 * @example
 * In this example, we first upload a score and then parse the `async_load` map returned if successful. The code below shows a typical example for uploading:
 * 
 * ```gml
 * if (hp <= 0)
 * {
 *     upload_ID = steam_upload_score_ext("Game Scores", score, true);
 *     if (!upload_ID)
 *     {
 *         alarm[0] = game_get_speed(gamespeed_fps);
 *     }
 * }
 * ```
 * Note that we have set an alarm if the call fails. This would be used to try the upload again at a later time and you can add extra code there to retry the upload or to save the score to a text file should it continue to fail, etc. We now add the following into the ${event.steam} for the instance controlling the scores:
 * 
 * ```gml
 * var _type = ds_map_find_value(async_load, "event_type");
 * if (_type == "leaderboard_upload")
 * {
 *     var _lb_ID = ds_map_find_value(async_load, "post_id");
 *     if _lb_ID == upload_ID
 *     {
 *         var _lb_name = ds_map_find_value(async_load, "lb_name");
 *         var _lb_done = ds_map_find_value(async_load, "success");
 *         var _lb_score = ds_map_find_value(async_load, "score");
 *         var _lb_updated = ds_map_find_value(async_load, "updated");
 *         show_debug_message("leaderboard post id:" + string(_lb_ID) + " to lb:" + string(_lb_name) + " with score:" + string(_lb_score) + " updated=" + string(_lb_updated));
 *         if (_lb_done)
 *         {
 *             show_debug_message("- Succeeded");
 *         }
 *         else
 *         {
 *             show_debug_message("- Failed");
 *         }
 *     }
 * }
 * ```
 * In the example we are simply outputting the return values to the compiler window as debug messages, but you can use this event to deal with the information in any way you choose.
 * @func_end
 */

/**
 * @func steam_upload_score_buffer
 * @desc This function will send a score to the given leaderboard along with a data package created from a buffer. The buffer should be no more than 256 bytes in size - anything beyond that will be chopped off - and can contain any data you require. The score to be uploaded should be a real number, and the leaderboard name is a string that was defined when you created the leaderboard using the function ${function.steam_create_leaderboard}.
 * 
 * [[NOTE: If the function call fails for any reason it will return -1 and the Async event will not be triggered.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are uploading the scores to
 * @param {real} score The score to upload
 * @param {type.buffer} buffer The ID of the buffer to attach
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} post_id The asynchronous request ID
 * @member {string} event_type The string value `"leaderboard_upload"`
 * @member {string} lb_name The name of the leaderboard
 * @member {real} num_entries The number of returned entries
 * @member {boolean} success Whether or not the request was successful
 * @member {boolean} updated Whether or not the leaderboard was updated (i.e.: the new score was better). Note that if you score was not updated neither will the data buffer.
 * @member {real} score The score that was posted to the leaderboard
 * @event_end
 * 
 * @example
 * In this example, we first upload a score and then parse the `async_load` map returned if successful. The code below shows a typical example for uploading, with a buffer being created to hold a string telling us which level the score was uploaded from:
 * 
 * ```gml
 * if (hp <= 0)
 * {
 *     var _buff = buffer_create(256, buffer_fixed, 1);
 *     buffer_write(_buff, buffer_string, "Uploaded on level " + string(global.Level));
 *     upload_ID = steam_upload_score("Game Scores", score, _buff);
 * 
 *     if (!upload_ID)
 *     {
 *         alarm[0] = game_get_speed(gamespeed_fps);
 *     }
 * 
 *     buffer_delete(_buff);
 * }
 * 
 * ```
 * Note that we have set an alarm if the call fails. This would be used to try the upload again at a later time and you can add extra code there to retry the upload or to save the score to a text file should it continue to fail, etc. Also note that we immediately delete the buffer, since it is no longer required for the function. We now add the following into the ${event.steam} for the instance controlling the scores:
 * 
 * ```gml
 * var _type = ds_map_find_value(async_load, "event_type");
 * if (_type == "leaderboard_upload")
 * {
 *     var _lb_ID = ds_map_find_value(async_load, "post_id");
 *     if _lb_ID == upload_ID
 *     {
 *         var _lb_name = ds_map_find_value(async_load, "lb_name");
 *         var _lb_done = ds_map_find_value(async_load, "success");
 *         var _lb_score = ds_map_find_value(async_load, "score");
 *         var _lb_updated = ds_map_find_value(async_load, "updated");
 *         show_debug_message("leaderboard post ID:" + string(_lb_ID) + " to lb:" + string(_lb_name) + " with score:" + string(_lb_score) + " updated=" + string(_lb_updated));
 *         if (_lb_done)
 *         {
 *             show_debug_message("- Succeeded");
 *         }
 *         else
 *         {
 *             show_debug_message("- Failed");
 *         }
 *     }
 * }
 * ```
 * In the example we are simply outputting the return values to the compiler window as debug messages, but you can use this event to deal with the information in any way you choose.
 * @func_end
 */

/**
 * @func steam_upload_score_buffer_ext
 * @desc This function will send a score to the given leaderboard along with a data package created from a buffer. The buffer should be no more than 256 bytes in size - anything beyond that will be chopped off - and can contain any data you require. This function is similar to ${function.steam_upload_score_buffer} but has an extra argument that will allow you to force the update of the score, as by default Steam only updates the score if it is better than the previous one.
 * 
 * [[NOTE: If the function call fails for any reason it will return -1 and the Async event will not be triggered.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are uploading the scores to
 * @param {real} score The score to upload
 * @param {type.buffer} buffer The ID of the buffer to attach
 * @param {boolean} force_update Whether or not the value should be replaced
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} post_id The asynchronous request ID
 * @member {string} event_type The string value `"leaderboard_upload"`
 * @member {string} lb_name The name of the leaderboard
 * @member {real} num_entries The number of returned entries
 * @member {boolean} success Whether or not the request was successful
 * @member {boolean} updated Whether or not the leaderboard was updated (i.e.: the new score was better or `forceUpdate` was set to `true`). Note that if you score was not updated neither will be the data buffer.
 * @member {real} score The score that was posted to the leaderboard
 * @event_end
 * 
 * @example
 * In this example, we first upload a score and then parse the `async_load` map returned if successful. The code below shows a typical example for uploading, with a buffer being created to hold a string telling us which level the score was uploaded from:
 * 
 * ```gml
 * if (hp <= 0)
 * {
 *     var _buff = buffer_create(256, buffer_fixed, 1 );
 *     buffer_write(_buff, buffer_string, "Uploaded on level " + string(global.Level));
 *     upload_ID = steam_upload_score_buffer_ext("Game Scores", score, _buff, true);
 * 
 *     if (!upload_ID)
 *     {
 *         alarm[0] = game_get_speed(gamespeed_fps);
 *     }
 * 
 *     buffer_delete(_buff);
 * }
 * 
 * ```
 * Note that we have set an alarm if the call fails. This would be used to try the upload again at a later time and you can add extra code there to retry the upload or to save the score to a text file should it continue to fail, etc. Also note that we immediately delete the buffer, since it is no longer required for the function. We now add the following into the ${event.steam} for the instance controlling the scores:
 * 
 * ```gml
 * var _type = ds_map_find_value(async_load, "event_type");
 * if (_type == "leaderboard_upload")
 * {
 *     var _lb_ID = ds_map_find_value(async_load, "post_id");
 *     if _lb_ID == upload_ID
 *     {
 *         var _lb_name = ds_map_find_value(async_load, "lb_name");
 *         var _lb_done = ds_map_find_value(async_load, "success");
 *         var _lb_score = ds_map_find_value(async_load, "score");
 *         var _lb_updated = ds_map_find_value(async_load, "updated");
 *         show_debug_message("leaderboard post ID:" + string(_lb_ID) + " to lb:" + string(_lb_name) + " with score:" + string(_lb_score) + " updated=" + string(_lb_updated));
 *         if (_lb_done)
 *         {
 *             show_debug_message("- Succeeded");
 *         }
 *         else
 *         {
 *             show_debug_message("- Failed");
 *         }
 *     }
 * }
 * ```
 * In the example we are simply outputting the return values to the compiler window as debug messages, but you can use this event to deal with the information in any way you choose.
 * @func_end
 */

/**
 * @func steam_download_scores
 * @desc This function is used to retrieve a sequential range of leaderboard entries by leaderboard ranking. The `start_idx` and `end_idx` parameters control the requested range of ranks, for example, you can display the top 10 on a leaderboard for your game by setting the start value to 1 and the end value to 10. The leaderboard name is a string that was defined when you created the leaderboard using the function ${function.steam_create_leaderboard}.
 * 
 * [[NOTE: If the function call fails for any reason it will return -1 and the async event will not be triggered.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are downloading the scores from
 * @param {real} start_idx The start position within the leaderboard
 * @param {real} end_idx The end position within the leaderboard
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} id The asynchronous request ID
 * @member {string} event_type The string value `"leaderboard_download"`
 * @member {int64} status The status code if download fails
 * @member {string} lb_name The name of the leaderboard
 * @member {real} num_entries The number of returned entries
 * @member {string} entries A JSON formatted string with all the downloaded entries (see ${struct.LeaderboardEntry} for details)
 * @event_end
 * 
 * @example
 * In this extended example we will request the top ten ranking for the given leaderboard and parse its results in the ${event.steam}. To start with we need to request the scores with the following code:
 * 
 * ```gml
 * score_get = steam_download_scores("Game Scores", 1, 10);
 * ```
 * This will send off a request to the Steam Server for the scores from the leaderboard "Game Scores", storing the async id of the request in the variable "score_get". this will then be handled in the Steam Async Event in the following way:
 * 
 * ```gml
 * var _async_id = ds_map_find_value(async_load, "id");
 * if _async_id == score_get
 * {
 *     var _entries = ds_map_find_value(async_load, "entries");
 *     var _map = json_decode(_entries);
 *     if ds_map_exists(_map, "default")
 *     {
 *         ds_map_destroy(_map);
 *         exit;
 *     }
 *     else
 *     {
 *         var _list = ds_map_find_value(_map, "entries");
 *         var _len = ds_list_size(_list);
 *         var _entry;
 *         for(var i = 0; i < _len; i++;)
 *         {
 *             _entry = ds_list_find_value(_list, i );
 *             steam_name[i] = ds_map_find_value(_entry, "name");
 *             steam_score[i] = ds_map_find_value(_entry, "score");
 *             steam_rank[i] = ds_map_find_value(_entry, "rank");
 *             steam_data[i] = ds_map_find_value(_entry, "data");
 *         }
 *     }
 *     ds_map_destroy(map);
 * }
 * ```
 * What we do here is first check the "id" key of the special ${var.async_load} DS map. If this value is the same as the value of the original call-back function (stored in the "score_get" variable) we then continue to process the data. The first thing we do is parse the `async_load` DS map for the key "entries" which will contain a JSON formatted string containing the leaderboard data. This JSON object is then decoded (see ${function.json_decode}) as another ${type.ds_map}, and this new map ID is stored in the variable "map".
 * This map is checked for the key "default" and if that is found then the map is destroyed and the event is exited. If no "default" key is found, the code will then parse the map to extract the necessary information about the leaderboard, by first extracting a DS list from the "entries" key of the DS map, and then looping through each entry of the list to get **another** DS map with the name, score and rank of each entry. These values are then stored to arrays.
 * Once the loop has finished, the JSON ${type.ds_map} is destroyed (which in turn destroys all the internal maps and lists). There is no need to destroy the ${var.async_load} DS map as this is handled for you by GameMaker.
 * @func_end
 */

/**
 * @func steam_download_scores_around_user
 * @desc This function is used to retrieve leaderboard entries relative to the current user's entry. The `range_start` parameter is the number of entries to retrieve **before** the current user's entry, and the `range_end` parameter is the number of entries after the current user's entry, and the current user's entry is **always** included in the results. For example, if the current user is number 5 on a given leaderboard, then setting the start range to -2 and the end range to 2 will return 5 entries: 3 through 7. If there are not enough entries in the leaderboard before or after the user's entry, Steam will adjust the range start and end points trying to maintained the range size. For example, if the user is #1 on the leaderboard, start is set to -2, and end is set to 2, Steam will return the first 5 entries in the leaderboard.
 * 
 * [[NOTE: If the function call fails for any reason it will return -1 and the async event will not be triggered.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are downloading the scores from
 * @param {real} range_start The start position within the leaderboard
 * @param {real} range_end The end position within the leaderboard
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} id The asynchronous request ID
 * @member {string} event_type The string value `"leaderboard_download"`
 * @member {int64} status The status code if download fails
 * @member {string} lb_name The name of the leaderboard
 * @member {real} num_entries The number of returned entries
 * @member {string} entries A JSON formatted string with all the downloaded entries (see ${struct.LeaderboardEntry} for details)
 * @event_end
 * 
 * ```gml
 * request_id = steam_download_scores_around_user("Game Scores", -4, 5);
 * ```
 * This will send off a request to the Steam Server for a range of 10 scores from the leaderboard `"Game Scores"`, centered on the player and will store the async ID of the request in the variable `request_id`. This will then be handled in the ${event.steam}, as shown in the example for ${function.steam_download_scores}.
 * @func_end
 */

/**
 * @func steam_download_friends_scores
 * @desc With this function you can retrieve *only* the scores on the leaderboard that belong to those people that are marked as "friends" in the Steam client. So, if your leaderboard has 200 entries, and 50 of them are your friends, this function will retrieve only those 50 results. The leaderboard name is a string that was defined when you created the leaderboard using the function ${function.steam_create_leaderboard}.
 * 
 * [[NOTE: If the function call fails for any reason it will return -1 and the async event will not be triggered.]]
 * 
 * @param {string} lb_name The name of the leaderboard that you are downloading the scores from
 * 
 * @returns {real}
 * 
 * @event steam
 * @member {real} id The asynchronous request ID
 * @member {string} event_type The string value `"leaderboard_download"`
 * @member {int64} status The status code if download fails
 * @member {string} lb_name The name of the leaderboard
 * @member {real} num_entries The number of returned entries
 * @member {string} entries A JSON formatted string with all the downloaded entries (see ${struct.LeaderboardEntry} for details)
 * @event_end
 * 
 * @example
 * ```gml
 * request_id = steam_download_friends_scores("Game Scores");
 * ```
 * This will send off a request to the Steam Server for the users friends scores from the given leaderboard and will store the async ID of the request in the variable `request_id`. This will then be handled in the ${event.steam}, as shown in the example for ${function.steam_download_scores}.
 * @func_end
 */

/**
 * @func steam_get_leaderboard_entry_count
 * @desc This function returns the total number of entries in a leaderboard.
 * 
 * The function returns -1 in case something went wrong.
 * 
 * @param {string} lb_name The name of the leaderboard.
 * 
 * @returns {real}
 * @func_end
 */

/**
 * @func steam_get_leaderboard_display_type
 * @desc This function returns the display type of a leaderboard handle.
 * 
 * The function returns -1 in case something went wrong.
 * 
 * @param {string} lb_name The name of the leaderboard.
 * 
 * @returns {constant.LeaderboardDisplayType}
 * @func_end
 */

/**
 * @struct LeaderboardEntry
 * @desc A leaderboard entry is represented by a JSON formatted string that can be returned by the async callback event of a couple of functions.
 * 
 * This string can be decoded into a ${type.ds_map} (see ${function.json_decode}, needs to be destroyed afterwards) or into a ${type.struct} (see ${function.json_parse}, recommended) and will provide the following members.
 * @member {real} rank The rank of the entry on the specified leaderboard
 * @member {string} data The base64 encoded string with the data provided when uploading scores using the ${function.steam_upload_score_buffer} or ${function.steam_upload_score_buffer_ext} functions :eight_pointed_black_star: OPTIONAL
 * @member {real} score The score attributed to this entry
 * @member {string} name The display name of the player for this entry
 * @member {int64} userID The unique user ID of the player for this entry
 * 
 * [[NOTE: If ${function.steam_upload_score_buffer} or ${function.steam_upload_score_buffer_ext} were used to upload the score, the decoded entry will now have a `"data"` key so you can retrieve the data of the uploaded buffer (see the ${event.steam} extended code example for further details). This data will be base64 encoded and so you will need to use the function ${function.buffer_base64_decode} on the data before reading from the buffer.]]
 * @struct_end
 */

/**
 * @const LeaderboardDisplayType
 * @desc These constants specify the display type of a leaderboard.
 * @member lb_disp_none Show the leaderboard "as is".
 * @member lb_disp_numeric Show the leaderboard as a numeric display.
 * @member lb_disp_time_sec Show the leaderboard values as times, with the base value being seconds.
 * @member lb_disp_time_ms Show the leaderboard values as times, with the base value being milliseconds
 * @const_end
 */

/**
 * @const LeaderboardSortOrder
 * @desc These constants specify the sort order of a leaderboard.
 * @member lb_sort_none No sorting. The information will be displayed "as is".
 * @member lb_sort_ascending Sort the leaderboard in ascending order.
 * @member lb_sort_descending Sort the leaderboard in descending order.
 * @const_end
 */

/**
 * @module leaderboards
 * @title Leaderboards
 * @desc The Steam API supports persistent leaderboards with automatically ordered entries. These leaderboards can be used to display global and friend leaderboards in your game and on the community web page for your game. Each game can have up to 10,000 leaderboards, and each leaderboard can be retrieved immediately after a player's score has been inserted into it, but note that for each leaderboard, a player can have only **one** entry, although there is no limit on the number of players per leaderboard.
 * 
 * @section_func Functions
 * @desc Each leaderboard entry contains a name, a score and a rank for the leaderboard, and this data will be replaced when a new leaderboard entry is created for the user, and the following functions can be used to add and retrieve this data form the leaderboards for your game:
 * @ref steam_create_leaderboard
 * @ref steam_upload_score
 * @ref steam_upload_score_ext
 * @ref steam_upload_score_buffer
 * @ref steam_upload_score_buffer_ext
 * @ref steam_download_scores
 * @ref steam_download_scores_around_user
 * @ref steam_download_friends_scores
 * @ref steam_get_leaderboard_entry_count
 * @ref steam_get_leaderboard_display_type
 * @section_end
 * 
 * @section_struct Structs
 * @desc The following data types are used by the leaderboard functions:
 * @ref LeaderboardEntry
 * @section_end
 * 
 * @section_const Constants
 * @desc The following constants are used by the leaderboard functions:
 * @ref LeaderboardDisplayType
 * @ref LeaderboardSortOrder
 * @section_end
 * 
 * @module_end
 */
