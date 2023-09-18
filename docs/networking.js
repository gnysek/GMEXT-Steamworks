// FUNCTIONS

/**
 * @func steam_net_packet_get_data
 * @desc This function copies the contents of the last received packet to the given buffer. Data is copied to the start of the buffer (position remains unaffected), meaning that if you reuse the same buffer, you should "rewind" it prior to reading.
 * 
 * [[NOTE: If the buffer is not big enough to fit data, it will be resized automatically (the buffer needs to be created using the using the `buffer_grow` type).]]
 * 
 * @param {type.buffer} buffer The buffer to write the incoming data to.
 * 
 * @returns {boolean}
 * 
 * @example
 * ```gml
 * while (steam_net_packet_receive())
 * {
 *     steam_net_packet_get_data(inbuf);
 *     buffer_seek(inbuf, buffer_seek_start, 0);
 *     switch (buffer_read(inbuf, buffer_u8))
 *     {
 *         case 1: show_debug_message("packet ID 1"); break;
 *         case 2: show_debug_message("packet ID 2"); break;
 *         default: show_debug_message("unknown packet"); break;
 *     }
 * }
 * ```
 * The code above will check for an incoming packet and get its data into a buffer (resizing if necessary) and reads from it.
 * @func_end
 */

/**
 * @func steam_net_packet_get_sender_id
 * @desc This function returns the Steam ID of the user that sent the last received packet.
 * Can be used in conjunction with ${function.steam_net_packet_send} to send something back and for just telling the senders apart.
 * 
 * @returns {int64}
 * 
 * @example
 * ```gml
 * while(steam_net_packet_receive())
 * {
 *     var _sender = steam_net_packet_get_sender_id();
 * 
 *     buffer_seek(outbuf, buffer_seek_start, 0);
 *     buffer_write(outbuf, buffer_u8, test_network_packet.ping);
 * 
 *     steam_net_packet_send(_sender, outbuf);
 * }
 * ```
 * The above code will show a code example.
 * @func_end
 */

/**
 * @func steam_net_packet_get_size
 * @desc This function returns the size of the last received packet, in bytes.
 * 
 * @returns {real}
 * 
 * @example
 * ```gml
 * while (steam_net_packet_receive())
 * {
 *     var _size = steam_net_packet_size();
 *     show_debug_message("Received " + string(_size) + " bytes.");
 * }
 * ```
 * The code above will display the size of each incoming packet.
 * @func_end
 */

/**
 * @func steam_net_packet_receive
 * @desc This function attempts to get the next packet from Steam API and returns whether successfully done so.
 * Other steam_net_ functions can then be used to get packet information/contents.
 * 
 * @returns {boolean}
 * 
 * @example
 * ```gml
 * while (steam_net_packet_receive())
 * {
 *     // process the received packet
 * }
 * ```
 * The code above will attempt to get the next packet from Steam API, would be used every step while in lobby or with less frequency otherwise.
 * @func_end
 */

/**
 * @func steam_net_packet_send
 * @desc This function sends a packet to the given endpoint, returns whether successful (as opposed to incorrect arguments/invalid ID). If no packet type is passed in then default value will be used, the default value can be set using the ${function.steam_net_packet_set_type} function. Returns whether or not the packet was successfully sent.
 * 
 * @param {int64} user_id  The target user to send the packet to
 * @param {real} buffer Buffer that contains the raw byte array for the packet data to send
 * @param {real} size The size of data to send (default -1, sends the entire buffer) :eight_pointed_black_star: OPTIONAL
 * @param {const.PacketType} packet_type The type of packet to be used :eight_pointed_black_star: OPTIONAL
 * 
 * @returns {boolean}
 * 
 * @example
 * ```gml
 * var _buf = buffer_create(16, buffer_grow, 1);
 * buffer_write(buf, buffer_string, "Hello!");
 * steam_net_packet_send(steam_id, _buf, -1);
 * buffer_delete(_buf);
 * ```
 * The code sample will create a buffer and write to it, sending the total length of it to the given `steam_id`, the buffer is then deleted.
 * @func_end
 */

/**
 * @func steam_net_packet_set_type
 * @desc This function sets the default connection protocol used when sending the data packets (using the ${function.steam_net_packet_send} function). Returns whether or not the default protocol was successfully set.
 * 
 * @param {constant.PacketType} protocol The default connection protocol to be used
 * 
 * @returns {boolean}
 * 
 * @example
 * ```gml
 * steam_net_packet_set_type(steam_net_packet_type_reliable);
 * ```
 * The above code will set the current connection to use the `steam_net_packet_type_reliable` protocol to send data packages.
 * @func_end
 */

/**
 * @func steam_net_accept_p2p_session
 * @desc This function accepts a P2P session request from the specified user. Returns whether successful or not.
 * 
 * @param {int64} userID The User ID of the user that sent the initial packet to us.
 * 
 * @returns {boolean}
 * 
 * @example
 * ```gml
 * if (isMyFriend(userID))
 * {
 *     steam_net_accept_p2p_session(userID);
 * }
 * ```
 * The code above uses a custom implemented function that will check if a given `userID` is a friend and if it is it will accept the P2P session.
 * @func_end
 */

/**
 * @func steam_net_close_p2p_session
 * @desc This function closes a P2P session with the specified user. It returns whether successful or not.
 * Steam will automatically close sessions after a period of inactivity, but you could also do it manually if you want.
 * 
 * @param {int64} user_id The user ID of the user to close the connection with.
 * 
 * @returns {boolean}
 * 
 * ```gml
 * if (global.chat_closed)
 * {
 *      steam_net_close_p2p_session(user_id);
 * }
 * ```
 * The code above check to see if a global variable (`chat_closed`) is true and if so, it will close the P2P session.
 * @func_end
 */

/**
 * @func steam_net_set_auto_accept_p2p_sessions
 * @desc This function sets whether to auto-accept session requests coming from players in the same lobby. This is enabled by default for convenience. If you disable it, you will need to handle the async event when someone uses the ${function.steam_lobby_join_id} function.
 * 
 * @param {boolean} enable disable/enable auto accept sessions
 * 
 * @event steam
 * @param {string} type The string value `"lobby_join_requested"`
 * @param {int64} lobby_id The lobby unique identifier
 * @param {int64} friend_id The friend unique identifier
 * @event_end
 * 
 * @example
 * ```gml
 * steam_net_set_auto_accept_p2p_sessions(false);
 * ```
 * The code above will disable the auto accept P2P sessions functionality meaning we  should deal with the requests manually. In order to do so we need to use the ${event.steam} to catch the callback:
 * 
 * ```gml
 * if (async_load[?"event_type"] == "lobby_join_requested")
 * {
 *     steam_net_accept_p2p_session(async_load[?"friend_id"]);
 * }
 * ```
 * @func_end
 */

/**
 * @const PacketType
 * @desc These constants specify the type of a steam packet.
 * 
 * @member steam_net_packet_type_unreliable Equivalent to UDP the data may or may not be delivered, will not be resent automatically.
 * @member steam_net_packet_type_unreliable_nodelay Similar to "unreliable" type, but always sent instantly (as soon as function is called). Intended for things like streaming voice data, where you want lowest latency possible and only care about the current data.
 * @member steam_net_packet_type_reliable Equivalent to TCP, the data is warranted to be delivered in order and intact.
 * @member steam_net_packet_type_reliable_buffer Similar to "reliable" type, but utilizes [Nagle's algorithm](https://en.wikipedia.org/wiki/Nagle's_algorithm) to reduce the number of packets at the cost of potential delay while the data accumulates until the sending threshold.
 * @const_end
 */

// MODULES

/**
 * @module Networking
 * @desc The following functions and constants allow you to use Steam's Networking functionality.
 * 
 * @section_func
 * @title Packets IO
 * @desc These functions are provided for handling sending and receiving packets:
 * 
 * @ref steam_net_packet_get_data
 * @ref steam_net_packet_get_sender_id
 * @ref steam_net_packet_get_size
 * @ref steam_net_packet_receive
 * @ref steam_net_packet_send
 * @ref steam_net_packet_set_type
 * @ref steam_net_accept_p2p_session
 * @ref steam_net_close_p2p_session
 * @ref steam_net_set_auto_accept_p2p_sessions
 * 
 * @section_end
 * 
 * @section_func session
 * @title Session
 * @desc The following functions allow handling P2P sessions:
 * 
 * @ref steam_net_accept_p2p_session
 * @ref steam_net_close_p2p_session
 * @ref steam_net_set_auto_accept_p2p_sessions
 * 
 * @section_end
 * 
 * @section_const
 * @title Constants
 * @desc These are the constants used by this API:
 * 
 * @ref PacketType
 * 
 * @section_end
 * 
 * @module_end
 */
