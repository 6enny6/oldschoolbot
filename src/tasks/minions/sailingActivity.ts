import { Task } from 'klasa';
import { Bank } from 'oldschooljs';

import { SkillsEnum } from '../../lib/skilling/types';
import { ActivityTaskOptions } from '../../lib/types/minions';
import { formatDuration, roll } from '../../lib/util';
import { handleTripFinish } from '../../lib/util/handleTripFinish';

export default class extends Task {
	async run(data: ActivityTaskOptions) {
		const { channelID, duration, userID } = data;
		const user = await this.client.users.fetch(userID);

		const xpReceived = user.skillLevel(SkillsEnum.Sailing) * 25 * 30;

		const xpRes = await user.addXP(SkillsEnum.Sailing, xpReceived);

		let str = `${user}, ${user.minionName} finished a ${formatDuration(
			duration
		)} Sailing trip. ${xpRes}.`;

		if (roll(100)) {
			str += `\n\n**While Sailing, you find a small puffin on a nearby island and take it back with you.**`;
			await user.addItemsToBank(new Bank().add('Craig'), true);
		}

		handleTripFinish(this.client, user, channelID, str, undefined, undefined, data, null);
	}
}