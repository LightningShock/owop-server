'use strict';
import ProtoDef from "protodef";
import protoData from "../owop-protocol/protocol.json";

export const States = {
	LOGIN: 0,
	PLAY: 1
};
for (let i in States) {
	States[States[i]] = i;
}

class NetworkState {
	constructor() {
		this.toClient = new ProtoDef.ProtoDef();
		this.toServer = new ProtoDef.ProtoDef();
	}
	
	deserialize(msg) {
		return this.toServer.parsePacketBuffer("packet", msg).data;
	}

	serialize(packet) {
		return this.toClient.createPacketBuffer("packet", packet);
	}
}

class LoginState extends NetworkState {
	constructor() {
		super();
		
		this.toClient.addProtocol(protoData, ["login", "toClient"]);
		this.toServer.addProtocol(protoData, ["login", "toServer"]);
	}
}

class PlayState extends NetworkState {
	constructor() {
		super();
		
		this.toClient.addProtocol(protoData, ["play", "toClient"]);
		this.toServer.addProtocol(protoData, ["play", "toServer"]);
	}
}

export class Protocol {
	constructor() {
		this.states = {
			[States.LOGIN]: new LoginState(),
			[States.PLAY]: new PlayState()
		};
	}
}

function isWorldNameValid(worldName) {
	/* a-z 0-9 _ . */
	var valid = new RegExp(/^([a-z0-9_\.])+$/g).test(worldName);
	/* 24 should be equal or greater than world name
	 * worldname should be greater than 0            */
	if(valid && 24 >= worldName.length > 0) return true;
	else return false;
}
