/**
 * Seasonal Ladders of Pokémon Showdown
 * The formats with the mod-like tweaks go into /config/formats.js
 * The team making scripts go into /data/random-teams.js
 *
 * THIS IS A BACKUP FILE.
 */

'use strict';

exports.Formats = [
	// Spacetime Funtimes, January 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/7fb61bf240975a9c93e302c9a2059b55ee458ffb
	{
		name: "[Seasonal] Spacetime Funtimes",
		mod: 'gen6',

		team: 'randomSeasonalSFT',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin() {
			this.add('message', "Dialga and Palkia have distorted space and time!");

			const scenarios = {
				'gallade': 'lotr', 'reshiram': 'lotr',
				'pikachu': 'redblue', 'pidgeot': 'redblue',
				'genesect': 'terminator', 'alakazam': 'terminator',
				'gengar': 'gen1',
				'groudon': 'desert', 'probopass': 'desert',
				'kyogre': 'shipwreck', 'machamp': 'shipwreck',
			};
			this.seasonal = {scenario: scenarios[this.p1.pokemon[0].speciesid]};

			// Add the message for the scenario.
			this.add('-message', {
				'gen1': "It appears that you have travelled to the past! This looks like... 1997!",
				'lotr': "You find yourselves in middle of an epic battle for Middle Earth!",
				'redblue': "Wow! You are taking part in the most epic Pokémon fight ever!",
				'terminator': "You are caught up in the epic apocalyptic battle of the machines against the humans!",
				'desert': "It's no less than the exodus itself!",
				'shipwreck': "You're on a giant ship that was rekt by an iceberg. And the fish Pokémon want to eat the sailors!",
			}[this.seasonal.scenario]);

			// Let's see what's the scenario and change space and time.
			if (this.seasonal.scenario === 'lotr') {
				this.addPseudoWeather('wonderroom', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.wonderroom.duration;
			} else if (this.seasonal.scenario === 'terminator') {
				this.addPseudoWeather('trickroom', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.trickroom.duration;
			} else if (this.seasonal.scenario === 'gen1') {
				this.addPseudoWeather('magicroom', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.magicroom.duration;
			} else if (this.seasonal.scenario === 'desert') {
				this.setWeather(this.sample(['Sandstorm', 'Sunnyday']));
				delete this.weatherData.duration;
			} else if (this.seasonal.scenario === 'shipwreck') {
				this.setWeather('raindance');
				this.addPseudoWeather('watersport', this.p1.pokemon[0], null, '[of] Seasonal');
				delete this.pseudoWeather.watersport.duration;
				delete this.weatherData.duration;
			}
		},
		onFaint(target, source) {
			if (this.seasonal.scenario === 'gen1') {
				if (source && source.removeVolatile) source.removeVolatile('mustrecharge');
				if (target && target.side) target.side.removeSideCondition('reflect');
				this.queue = [];
			}
		},
		onModifyMove(move) {
			if (this.seasonal.scenario === 'gen1') {
				if (move.id === 'blizzard') {
					move.accuracy = 90;
				}
				if (move.id === 'psychic') {
					move.secondary = {chance: 33, boosts: {spd: -1, spa: -1}};
				}
				if (move.id === 'amnesia') {
					move.boosts = {spa: 2, spd: 2};
				}
				if (move.id === 'hyperbeam') {
					move.category = 'Physical';
				}
			}
			if (this.seasonal.scenario === 'lotr') {
				if (move.id === 'growl') {
					move.name = 'Throw ring to lava';
					move.category = 'Special';
					move.basePower = 160;
					move.type = 'Fire';
					move.accuracy = true;
					move.self = {volatileStatus: 'mustrecharge'};
					move.onTryHit = function () {
						this.add('-message', 'Frodo throws the one ring into the lava!');
					};
				}
				if (move.id === 'thousandarrows') {
					move.onBasePower = function (basePower, pokemon, target) {
						if (target.name === 'Smaug') {
							this.add('-message', "Bard's arrow pierces through Smaug's diamond-tough skin!");
							return this.chainModify(3);
						}
					};
				}
			}
		},
		onSwitchIn(pokemon) {
			if (this.seasonal.scenario === 'lotr') {
				if (pokemon.name === 'Frodo') {
					this.add('-message', 'The One Ring gives power to Frodo!');
					this.boost({def: 2, spd: 2, evasion: 2}, pokemon);
					if (pokemon.setType(['Ground', 'Fairy'])) {
						this.add('-start', pokemon, 'typechange', 'Ground/Fairy', '[silent]');
					}
				}
				if (pokemon.name === 'Gandalf') {
					this.add('-message', 'Fly, you fools!');
					this.boost({spe: 1}, pokemon);
				}
				if (pokemon.name === 'Saruman') {
					this.add('-message', 'Against the power of Mordor there can be no victory.');
					this.boost({spd: 1}, pokemon);
				}
				if (pokemon.name === 'Legolas') {
					this.add('-message', "They're taking the hobbits to Isengard!");
					this.boost({atk: 1, spa: 1}, pokemon);
				}
				if (pokemon.name === 'Boromir') {
					this.add('-message', 'One does not simply walk into Mordor.');
					pokemon.addVolatile('confusion');
				}
				if (pokemon.name === 'Aragorn') {
					this.add('-message', 'Aragorn, son of Arathor, king of Gondor.');
					this.boost({spd: 1}, pokemon);
				}
				if (pokemon.name === 'Pippin') {
					this.add('-message', 'How about second breakfast?');
					this.boost({def: 1, spd: 1}, pokemon);
				}
				if (pokemon.name === 'Merry') {
					this.add('-message', "I don't think he knows about second breakfast, Pippin.");
					this.boost({def: 1, spd: 1}, pokemon);
				}
				if (pokemon.name === 'Samwise') {
					this.add('-message', 'Mr. Frodo!!');
					if (pokemon.setType(['Normal', 'Fairy'])) {
						this.add('-start', pokemon, 'typechange', 'Normal/Fairy', '[silent]');
					}
					this.boost({spe: 3}, pokemon);
				}
				if (pokemon.name === 'Nazgûl') {
					this.add('-message', 'One ring to rule them all.');
				}
				if (pokemon.name === 'Smaug') {
					this.add('-message', 'I am fire. I am death.');
				}
				if (pokemon.name === 'Treebeard') {
					this.add('-message', 'Come, my friends. The ents are going to war!');
					this.boost({spe: 2}, pokemon);
				}
				if (pokemon.name === 'Bard') {
					this.add('-message', 'Black arrow! Go now and speed well!');
					this.boost({accuracy: 1, evasion: 1}, pokemon);
				}
				if (pokemon.name === 'Gollum') {
					this.add('-message', 'My preciousssss!');
					this.boost({accuracy: 6, evasion: 1}, pokemon);
				}
			}
			if (this.seasonal.scenario === 'gen1') {
				pokemon.side.removeSideCondition('reflect');
			}
			if (this.seasonal.scenario === 'desert') {
				if (pokemon.name === 'Moses') {
					this.add('-message', 'Let my people go!');
					this.boost({spd: 1}, pokemon);
				}
			}
		},
	},

	// Han vs Hun, February 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/c75b0db6fa0c07e0ce5738d55834dd1f29efec61
	{
		// Get it? They're Han Chinese!
		name: "[Seasonal] Han vs Hun",
		mod: 'gen6',

		team: 'randomSeasonalMulan',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin() {
			this.add('message', "General Li Shang! The Huns are marching towards the Imperial City! Train your recruits quickly and make your stand!");
			this.seasonal = {
				songCount: 0,
				song: [
					"Let's get down to business, to defeat the Huns!", "Did they send me daughters, when I asked for sons?",
					"You're the saddest bunch I ever met.", "But you can bet, before we're through...", "Mister, I'll make a man out of you!",
					"Tranquil as a forest, but on fire within.", "Once you find your center, you are sure to win!",
					"You're a spineless, pale, pathetic lot, and you haven't got a clue.", "Somehow, I'll make a man out of you!",
					"I'm never gonna catch my breath...", "Say goodbye to those who knew me...", "Boy, was I a fool in school for cutting gym...",
					"This guy's got them scared to death!", "Hope he doesn't see right through me...", "Now I really wish I knew how to swim...",
					"We must be swift as a coursing river!", "With all the force of a great typhoon!", "With all the strength of a raging fire!",
					"Mysterious as the dark side of the moon!", "Time is racing towards us, 'til the Huns arrive.",
					"Heed my every order, and you might survive!", "You're unsuited for the rage of war.", "So pack up, go home, you're through.",
					"How could I make a man out of you?", "We must be swift as a coursing river!", "With all the force of a great typhoon!",
					"With all the strength of a raging fire!", "Mysterious as the dark side of the moon!",
				],
				verses: {4: true, 8: true, 14: true, 18: true, 23: true, 27: true},
				morale: 0,
			};
		},
		onModifyMove(move) {
			if (move.id === 'sing') {
				move.name = "Train Recruits";
				move.accuracy = 100;
				move.target = "self";
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Bulk Up", source);
					if (this.seasonal.songCount < this.seasonal.song.length) {
						this.add('-message', '"' + this.seasonal.song[this.seasonal.songCount] + '"');
						if (this.seasonal.verses[this.seasonal.songCount]) {
							this.add('-message', "Because of the difficult training, the new recruits are more experienced!");
							if (this.seasonal.songCount === 27) {
								this.add('-message', "The recruits are now fully trained!");
							}
							this.seasonal.morale++;
						}
						this.seasonal.songCount++;
					} else {
						this.add('-message', "The soldiers cannot be trained further!");
					}
					return null;
				};
			} else if (move.id === 'searingshot') {
				move.name = "Fire Rocket";
				move.category = 'Physical';
				move.basePower = 160;
				move.type = '???';
				move.accuracy = 80;
				move.willCrit = false;
				delete move.secondaries;
				delete move.flags.bullet;
				move.ignoreOffense = true; // Fireworks not affected by boosts from morale
				move.onTry = function (source, target) {
					this.attrLastMove('[still]');
					// If the soldier is inexperienced, the rocket can explode in their face. 50% chance at 0 morale, 33% at 1, 17% at 2, 0% afterwards.
					if (source.name !== 'Li Shang' && !this.randomChance(this.seasonal.morale + 2, 6)) {
						this.add('-anim', source, "Eruption", source);
						this.add('-message', "But " + source.name + "'s inexperience caused the rocket to backfire!");
						this.damage(Math.ceil(source.maxhp / 8), source, source, "the explosion", true);
						return null;
					} else {
						this.add('-anim', source, "Eruption", target);
					}
				};
			} else if (move.id === 'sacredfire') {
				// Sorry, Sacred Fire's burn chance is too good for this format, since mostly Physical attackers
				delete move.secondaries;
			}
		},
		onSwitchIn(pokemon) {
			this.seasonal.morale = this.seasonal.morale || 0;
			if (pokemon.name in {'Mulan': 1, 'Yao': 1, 'Ling': 1, 'Chien-Po': 1}) {
				const offense = Math.ceil(this.seasonal.morale / 2) - 1;
				const defense = Math.floor(this.seasonal.morale / 2) - 1;
				this.boost({atk: offense, spa: offense, def: defense, spd: defense}, pokemon, pokemon, this.getMove('sing'));
			}

			// Make Mushu Dragon/Fire type.
			if (pokemon.name === 'Mushu') {
				pokemon.addType('Fire');
				this.add('-start', pokemon, 'typeadd', 'Fire', '[from] ' + pokemon);
			}
		},
		onResidual() {
			if (this.seasonal.songCount < this.seasonal.song.length) {
				this.add('-message', '"' + this.seasonal.song[this.seasonal.songCount] + '"');
				if (this.seasonal.verses[this.seasonal.songCount]) {
					this.add('-message', "Because of the difficult training, the new recruits are more experienced!");
					if (this.seasonal.songCount === 27) {
						this.add('-message', "The recruits are now fully trained!");
					}
					let boostPokemon;
					if (this.p1.active[0].name in {'Mulan': 1, 'Yao': 1, 'Ling': 1, 'Chien-Po': 1}) {
						boostPokemon = this.p1.active[0];
					} else if (this.p2.active[0].name in {'Mulan': 1, 'Yao': 1, 'Ling': 1, 'Chien-Po': 1}) {
						boostPokemon = this.p2.active[0];
					}
					if (boostPokemon && boostPokemon.hp) {
						const boosts = (this.seasonal.morale % 2 ? {def: 1, spd: 1} : {atk: 1, spa: 1});
						this.boost(boosts, boostPokemon, boostPokemon, this.getMove('sing'));
					}
					this.seasonal.morale++;
				}
				this.seasonal.songCount++;
			}
		},
	},

	// Super Staff Bros., March - April 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/120995476512db995ecd3e5c8fdc898d6cd634cd

	{
		name: "[Seasonal] Super Staff Bros.",

		team: 'randomSeasonalStaff',
		ruleset: ['Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin() {
			// This seasonal gets a bit from Super Smash Bros., that's where the initial message comes from.
			this.add('message', "GET READY FOR THE NEXT BATTLE!");
			// This link leads to a post where all signature moves can be found so the user can use this resource while battling.
			this.add("raw|Seasonal help for moves can be found <a href='https://www.smogon.com/forums/threads/3491902/page-6#post-6093168'>here</a>");
			// Prepare Steamroll's special lead role.
			if (toId(this.p1.pokemon[0].name) === 'steamroll') {
				this.add('c|@Steamroll|I wasn\'t aware we were starting. Allow me...');
				this.p1.pokemon[0].isLead = true;
			}
			if (toId(this.p2.pokemon[0].name) === 'steamroll') {
				this.add('c|@Steamroll|I wasn\'t aware we were starting. Allow me...');
				this.p2.pokemon[0].isLead = true;
			}
			// This variable saves the status of a spammy conversation to be played, so it's only played once.
			this.convoPlayed = false;

			// This code here is used for the renaming of moves showing properly on client.
			let globalRenamedMoves = {
				'defog': "Defrog",
			};
			let customRenamedMoves = {
				"cathy": {
					'kingsshield': "Heavy Dosage of Fun",
					'calmmind': "Surplus of Humour",
					'shadowsneak': "Patent Hilarity",
					'shadowball': "Ion Ray of Fun",
					'shadowclaw': "Sword of Fun",
					'flashcannon': "Fun Cannon",
					'dragontail': "/kick",
					'hyperbeam': "/ban",
				},
			};

			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);

			for (let i = 0, len = allPokemon.length; i < len; i++) {
				let pokemon = allPokemon[i];
				let last = pokemon.moves.length - 1;
				if (pokemon.moves[last]) {
					pokemon.moveSlots[last].move = pokemon.set.signatureMove;
					pokemon.baseMoveSlots[last].move = pokemon.set.signatureMove;
				}
				for (let j = 0; j < pokemon.moveSlots.length; j++) {
					let moveData = pokemon.moveSlots[j];
					if (globalRenamedMoves[moveData.id]) {
						moveData.move = globalRenamedMoves[moveData.id];
						pokemon.baseMoveSlots[j].move = moveData.move;
					}

					let customRenamedSet = customRenamedMoves[toId(pokemon.name)];
					if (customRenamedSet && customRenamedSet[moveData.id]) {
						moveData.move = customRenamedSet[moveData.id];
						pokemon.baseMoveSlots[j].move = moveData.move;
					}
				}
			}
		},
		// Here we add some flavour or design immunities.
		onImmunity(type, pokemon) {
			// Great Sage is naturally immune to Attract.
			if (type === 'attract' && toId(pokemon.name) === 'greatsage') {
				this.add('-immune', pokemon, '[from] Irrelevant');
				return false;
			}
			// qtrx is immune to Torment or Taunt.
			if ((type === 'torment' || type === 'taunt') && pokemon.volatiles['unownaura']) {
				this.add('-immune', pokemon, '[from] Unown aura');
				return false;
			}
			// Somalia's Ban Spree makes it immune to some move types, since he's too mad to feel pain.
			// Types have been chosen from types you can be immune against with an ability.
			if (toId(pokemon.name) === 'somalia' && type in {'Ground': 1, 'Water': 1, 'Fire': 1, 'Grass': 1, 'Poison': 1, 'Normal': 1, 'Electric': 1}) {
				this.add('-message', "You can't stop SOMALIA in middle of his Ban Spree!");
				return false;
			}
		},
		// Hacks for megas changed abilities. This allow for their changed abilities.
		onUpdate(pokemon) {
			let name = toId(pokemon.name);

			if (pokemon.template.isMega) {
				if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
					pokemon.setAbility('cloudnine'); // Announced ability.
				}
				if (name === 'enguarde' && pokemon.getAbility().id === 'innerfocus') {
					pokemon.setAbility('superluck');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'shrang' && pokemon.getAbility().id === 'levitate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'audiosurfer' && pokemon.getAbility().id === 'healer') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'dtc' && pokemon.getAbility().id === 'toughclaws') {
					pokemon.setAbility('levitate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'trinitrotoluene' && pokemon.getAbility().id === 'toughclaws') {
					pokemon.setAbility('protean');
					this.add('-ability', pokemon, pokemon.ability);
				}
			}
		},
		// Here we treat many things, read comments inside for information.
		onSwitchInPriority: 1,
		onSwitchIn(pokemon) {
			let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			// No OP pls. Balance stuff, changing them upon switch in. Wonder Guard gets curse to minimise their turns out.
			if (pokemon.getAbility().id === 'wonderguard') {
				pokemon.addVolatile('curse', pokemon);
				this.add('-message', pokemon.name + "'s Wonder Guard has cursed it!");
			}
			// Weak Pokémon get a boost so they can fight amongst the other monsters.
			// Innovamania is just useless, so the boosts are a prank.
			if (name === 'test2017' && !pokemon.illusion) {
				this.boost({atk: 1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'okuu' && !pokemon.illusion) {
				this.boost({def: 2, spd: 1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'innovamania' && !pokemon.illusion) {
				this.boost({atk: 6, def: 6, spa: 6, spd: 6, spe: 6, accuracy: 6}, pokemon, pokemon, 'divine grace');
			}
			if (name === 'bloobblob' && !pokemon.illusion) {
				this.boost({def: 1, spd: 1, spe: 2}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'timbuktu' && !pokemon.illusion) {
				this.boost({def: -2, spd: -1}, pokemon, pokemon, 'innate ability');
			}
			if (name === 'electrolyte') {
				pokemon.lastAttackType = 'None';
			}
			// Deal with kupo's special transformation ability.
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
			// Deal with Timbuktu's move (read onModifyMove relevant part).
			if (name === 'timbuktu') {
				pokemon.timesGeoblastUsed = 0;
			}

			// Add here more hacky stuff for mega abilities.
			// This happens when the mega switches in, as opposed to mega-evolving on the turn.
			if (pokemon.template.isMega) {
				if (name === 'theimmortal' && pokemon.getAbility().id !== 'cloudnine') {
					pokemon.setAbility('cloudnine'); // Announced ability.
				}
				if (name === 'dell' && pokemon.getAbility().id !== 'adaptability') {
					pokemon.setAbility('adaptability');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'enguarde' && pokemon.getAbility().id !== 'superluck') {
					pokemon.setAbility('superluck');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'skitty' && pokemon.getAbility().id !== 'shedskin') {
					pokemon.setAbility('shedskin');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'audiosurfer' && pokemon.getAbility().id !== 'pixilate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'dtc' && pokemon.getAbility().id !== 'levitate') {
					pokemon.setAbility('levitate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'shrang' && pokemon.getAbility().id !== 'pixilate') {
					pokemon.setAbility('pixilate');
					this.add('-ability', pokemon, pokemon.ability);
				}
				if (name === 'trinitrotoluene' && pokemon.getAbility().id !== 'protean') {
					pokemon.setAbility('protean');
					this.add('-ability', pokemon, pokemon.ability);
				}
			} else {
				pokemon.canMegaEvo = this.canMegaEvo(pokemon); // Bypass one mega limit.
			}

			// Add here special typings, done for flavour mainly.
			if (name === 'mikel' && !pokemon.illusion) {
				if (pokemon.setType(['Normal', 'Ghost'])) {
					this.add('-start', pokemon, 'typechange', 'Normal/Ghost', '[silent]');
				}
			}
			if (name === 'qtrx') {
				this.add('-message', pokemon.name + " is radiating an Unown aura!"); // Even if only illusion.
				if (!pokemon.illusion) {
					pokemon.addVolatile('unownaura');
					if (pokemon.setType(['Normal', 'Psychic'])) {
						this.add('-start', pokemon, 'typechange', 'Normal/Psychic', '[silent]');
					}
				}
				pokemon.addVolatile('focusenergy');
				this.boost({evasion: -1}, pokemon, pokemon, 'Unown aura');
			}
			if (name === 'birkal' && !pokemon.illusion) {
				pokemon.addType('Bird');
				this.add('-start', pokemon, 'typeadd', 'Bird', '[from] ability: Caw');
			}

			// Edgy switch-in sentences go here.
			// Sentences vary in style and how they are presented, so each Pokémon has its own way of sending them.
			let sentences = [];
			let sentence = '';

			// Admins.
			if (name === 'antar') {
				this.add("c|~Antar|It's my time in the sun.");
			}
			if (name === 'chaos') {
				this.add("c|~chaos|I always win");
			}
			if (name === 'haunter') {
				this.add("c|~haunter|Dux mea lux");
			}
			if (name === 'jasmine') {
				if (this[((pokemon.side.id === 'p1') ? 'p2' : 'p1')].active[0].name.charAt(0) === '%') {
					sentence = "Back in my day we didn't have Drivers.";
				} else {
					sentences = ["Your mum says hi.", "Sorry I was just enjoying a slice of pineapple pizza, what was I supposed to do again?", "I could go for some Cheesy Chips right about now.", "I'd tap that.", "/me throws coffee at the server"];
					sentence = this.sample(sentences);
				}
				this.add('c|~Jasmine|' + sentence);
			}
			if (name === 'joim') {
				let dice = this.random(4);
				if (dice === 1) {
					// Fullscreen toucan!
					this.add('-message', '░░░░░░░░▄▄▄▀▀▀▄▄███▄');
					this.add('-message', '░░░░░▄▀▀░░░░░░░▐░▀██▌');
					this.add('-message', '░░░▄▀░░░░▄▄███░▌▀▀░▀█');
					this.add('-message', '░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌');
					this.add('-message', '░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄');
					this.add('-message', '░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄');
					this.add('-message', '░░░░░░░░░░░░░▐░░░░▐███████████▄');
					this.add('-message', '░░blessed by░░░░▐░░░░▐█████████████▄');
					this.add('-message', '░░le toucan░░░░░░▀▄░░░▐██████████████▄');
					this.add('-message', '░░░░░░ of ░░░░░░░░▀▄▄████████████████▄');
					this.add('-message', '░░░░░luck░░░░░░░░░░░░░█▀██████');
				} else if (dice === 2) {
					// Too spammy, sends it to chat only.
					this.add('c|~Joim|░░░░░░░░░░░░▄▐');
					this.add('c|~Joim|░░░░░░▄▄▄░░▄██▄');
					this.add('c|~Joim|░░░░░▐▀█▀▌░░░░▀█▄');
					this.add('c|~Joim|░░░░░▐█▄█▌░░░░░░▀█▄');
					this.add('c|~Joim|░░░░░░▀▄▀░░░▄▄▄▄▄▀▀');
					this.add('c|~Joim|░░░░▄▄▄██▀▀▀▀');
					this.add('c|~Joim|░░░█▀▄▄▄█░▀▀');
					this.add('c|~Joim|░░░▌░▄▄▄▐▌▀▀▀');
					this.add('c|~Joim|▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED');
					this.add('c|~Joim|▀█▌░░░▄░▀█▀░▀');
					this.add('c|~Joim|░░░░░░░▄▄▐▌▄▄ BY THE');
					this.add('c|~Joim|░░░░░░░▀███▀█░▄');
					this.add('c|~Joim|░░░░░░▐▌▀▄▀▄▀▐▄ SPOOKY SKILENTON');
					this.add('c|~Joim|░░░░░░▐▀░░░░░░▐▌');
					this.add('c|~Joim|░░░░░░█░░░░░░░░█');
					this.add('c|~Joim|░░░░░▐▌░░░░░░░░░█');
					this.add('c|~Joim|░░░░░█░░░░░░░░░░▐▌SEND THIS TO 7 PPL OR SKELINTONS WILL EAT YOU');
				} else if (dice === 3) {
					this.add('-message', '░░░░░░░░░░░░▄▄▄▄░░░░░░░░░░░░░░░░░░░░░░░▄▄▄▄▄');
					this.add('-message', '░░░█░░░░▄▀█▀▀▄░░▀▀▀▄░░░░▐█░░░░░░░░░▄▀█▀▀▄░░░▀█▄');
					this.add('-message', '░░█░░░░▀░▐▌░░▐▌░░░░░▀░░░▐█░░░░░░░░▀░▐▌░░▐▌░░░░█▀');
					this.add('-message', '░▐▌░░░░░░░▀▄▄▀░░░░░░░░░░▐█▄▄░░░░░░░░░▀▄▄▀░░░░░▐▌');
					this.add('-message', '░█░░░░░░░░░░░░░░░░░░░░░░░░░▀█░░░░░░░░░░░░░░░░░░█');
					this.add('-message', '▐█░░░░░░░░░░░░░░░░░░░░░░░░░░█▌░░░░░░░░░░░░░░░░░█');
					this.add('-message', '▐█░░░░░░░░░░░░░░░░░░░░░░░░░░█▌░░░░░░░░░░░░░░░░░█');
					this.add('-message', '░█░░░░░░░░░░░░░░░░░░░░█▄░░░▄█░░░░░░░░░░░░░░░░░░█');
					this.add('-message', '░▐▌░░░░░░░░░░░░░░░░░░░░▀███▀░░░░░░░░░░░░░░░░░░▐▌');
					this.add('-message', '░░█░░░░░░░░░░░░░░░░░▀▄░░░░░░░░░░▄▀░░░░░░░░░░░░█');
					this.add('-message', '░░░█░░░░░░░░░░░░░░░░░░▀▄▄▄▄▄▄▄▀▀░░░░░░░░░░░░░█');
				} else {
					sentences = ["Gen 1 OU is a true skill metagame.", "Finally a good reason to punch a teenager in the face!", "So here we are again, it's always such a pleasure.", "( ͝° ͜ʖ͡°)"];
					this.add('c|~Joim|' + this.sample(sentences));
				}
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Give me my robe, put on my crown!');
			}
			if (name === 'v4') {
				sentences = ["Oh right. I'm still here...", "WHAT ELSE WERE YOU EXPECTING?!", "Soaring on beautiful buttwings."];
				this.add('c|~V4|' + this.sample(sentences));
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|Your mom');
			}

			// Leaders.
			if (name === 'hollywood') {
				this.add('c|&hollywood|Kappa');
			}
			if (name === 'jdarden') {
				this.add('c|&jdarden|Did someone call for some BALK?');
			}
			if (name === 'okuu') {
				sentences = ["Current Discussion Topics: Benefits of Nuclear Energy, green raymoo worst raymoo, ...", "Current Discussion Topics: I ate the Sun - AMA, Card Games inside of Fighting Games, ...", "Current Discussion Topics: Our testing process shouldn't include Klaxons, Please remove Orin from keyboard prior to entering chat, ...", "Current Discussion Topics: Please refrain from eating crow, We'll get out of Beta once we handle all of this Alpha Decay, ...", "Current Discussion Topics: Schroedinger's Chen might still be in that box, I'm So Meta Even This Acronym, ...", "Current Discussion Topics: What kind of idiot throws knives into a thermonuclear explosion?, わからない ハハハ, ..."];
				this.add("raw|<div class=\"broadcast-blue\"><b>" + this.sample(sentences) + "</b></div>");
			}
			if (name === 'sirdonovan') {
				this.add('c|&sirDonovan|Oh, a battle? Let me finish my tea and crumpets');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|xD');
			}
			if (name === 'verbatim') {
				this.add('c|&verbatim|All in');
			}

			// Mods.
			if (name === 'acedia') {
				this.add('c|@Acedia|Time for a true display of skill ( ͡° ͜ʖ ͡°)');
			}
			if (name === 'am') {
				this.add('c|@AM|Lucky and Bad');
			}
			if (name === 'antemortem') {
				this.add('c|@antemortem|I Am Here To Oppress Users');
			}
			if (name === 'ascriptmaster') {
				this.add("c|@Ascriptmaster|Good luck, I'm behind 7 proxies");
			}
			if (name === 'asgdf') {
				sentences = ["Steel waters run deep, they say!", "I will insteell fear in your heart!", "Man the harpuns!"];
				this.add('c|@asgdf|' + this.sample(sentences));
			}
			if (name === 'audiosurfer') {
				pokemon.phraseIndex = this.random(3);
				if (pokemon.phraseIndex === 2) {
					let singers = ['Waxahatchee', 'Speedy Ortiz', 'Sufjan Stevens', 'Kendrick Lamar'];
					this.add('c|@Audiosurfer|Have you heard the new ' + this.sample(singers) + ' song?');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Audiosurfer|If you were worth playing you wouldn\'t be on the ladder.');
				} else {
					this.add('c|@Audiosurfer| Just came back from surfing. Don\'t believe me? Here\'s a pic: http://fc02.deviantart.net/fs70/i/2011/352/d/3/surf_all_the_oceans_by_dawn_shade-d4jga6b.png');
				}
			}
			if (name === 'barton') {
				this.add('c|@barton|free passion');
			}
			if (name === 'bean') {
				sentences = ["Everybody wants to be a cat", "if you KO me i'll ban u on PS", "just simply outplay the coin-toss"];
				this.add('c|@bean|' + this.sample(sentences));
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|Grovel peasant, you are in the presence of the RNGesus');
			}
			if (name === 'biggie') {
				sentences = ["Now I'm in the limelight cause I rhyme tight", "HAPPY FEET! WOMBO COMBO!", "You finna mess around and get dunked on"];
				this.add('c|@BiGGiE|' + this.sample(sentences));
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin|How Can Mirrors Be Real If Our Eyes Aren\'t Real? ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'businesstortoise') {
				this.add('c|@Business Tortoise|' + this.sample(["Another day, another smile :)", "Hello this is steve, how may I help you?"]));
			}
			if (name === 'coolstorybrobat') {
				pokemon.phraseIndex = this.random(5);
				switch (pokemon.phraseIndex) {
				case 1:
					sentence = "Time to GET SLAYED";
					break;
				case 2:
					sentence = "BRUH!";
					break;
				case 3:
					sentence = "Ahem! Gentlemen...";
					break;
				case 4:
					sentence = "I spent 6 months training in the mountains for this day!";
					break;
				default:
					sentence = "Shoutout to all the pear...";
				}
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'dell') {
				this.add('c|@Dell|<[~.~]> Next best furry besides Yoshi taking the stand!');
			}
			if (name === 'eeveegeneral') {
				sentences = ['Eevee army assemble!', 'To the ramparts!', 'You and what army?'];
				this.add('c|@Eevee General|' + this.sample(sentences));
			}
			if (name === 'electrolyte') {
				this.add('c|@Electrolyte|Eyyy where the middle school azn girls at??');
			}
			if (name === 'eos') {
				this.add('c|@Eos|ᕦ༼ຈل͜ຈ༽ᕤ');
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|/me enters battle');
			}
			if (name === 'genesect') {
				pokemon.phraseIndex = this.random(6);
				if (pokemon.phraseIndex === 5) {
					this.add('-message', '░░ ░░ ██ ██ ██ ██ ██ ░░ ░░');
					this.add('-message', '░░ ██ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ██ ░░');
					this.add('-message', '██ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ██');
					this.add('-message', '██ ▓▓ ▓▓ ██ ██ ██ ▓▓ ▓▓ ██');
					this.add('-message', '██ ██ ██ ██ ░░ ██ ██ ██ ██');
					this.add('-message', '██ ▒▒ ▒▒ ██ ██ ██ ▒▒ ▒▒ ██');
					this.add('-message', '██ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ██');
					this.add('-message', '░░ ██ ▒▒ ▒▒ ▒▒ ▒▒ ▒▒ ██ ░░');
					this.add('-message', '░░ ░░ ██ ██ ██ ██ ██ ░░ ░░');
				} else if (pokemon.phraseIndex === 4) {
					this.add('c|@Genesect|┬┴┬┴┤  ʕ├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ ʕ•├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ʕ•ᴥ├┬┴┬┴');
					this.add('c|@Genesect|Shitposting?');
				} else if (pokemon.phraseIndex === 3) {
					this.add('-message', '▄ ▄▄░░░░░░░▄▄▄▄░░░░▌▄▄▄▄▄░░░░░▐▌');
					this.add('-message', '▒▀█▌░░░▐▀▀▄▄▐▌▒░░▒▀▒▄▒█▄░░░░▐▌');
					this.add('-message', '░░▀█▒░░▓░░█▐█▌▌░░▒░▐▌█▌▐▌░░▐▌░');
					this.add('-message', '░░░░░░▓▀░░▒▐▀▄▀▀▀▀▒▒▀▀░░▀▌▒▀░░');
					this.add('-message', '░░░░░░▌░░░░░░▀▄▄▄▄▀░░░░░░▌░░░░');
					this.add('-message', '░░░░░▄▌░░░░░░░░░░░░░░░░░░▒░░░░');
				} else if (pokemon.phraseIndex === 2) {
					this.add('c|@Genesect|Born too early to explore the universe');
					this.add('c|@Genesect|Born too late to explore the world');
					this.add('c|@Genesect|Born just in time to explore ＤＡＮＫＭＥＭＥＳ');
				} else if (pokemon.phraseIndex === 1) {
					this.add('-message', '░░░░░░░░░░▄▄▄▄▄▄░░░░░░░░░░');
					this.add('-message', '░░░░░░░░▄▀█▀█▄██████████▄▄');
					this.add('-message', '░░░░░░░▐██████████████████▌');
					this.add('-message', '░░░░░░░███████████████████▌');
					this.add('-message', '░░░░░░▐███████████████████▌');
					this.add('-message', '░░░░░░█████████████████████▄');
					this.add('-message', '░░░▄█▐█▄█▀█████████████▀█▄█▐█▄');
					this.add('-message', '░▄██▌██████▄█▄█▄█▄█▄█▄█████▌██▌');
					this.add('-message', '████▄▀▀▀▀████████████▀▀▀▀▄███');
					this.add('-message', '█████████▄▄▄▄▄▄▄▄▄▄▄▄██████▀');
					this.add('-message', '░░░▀▀████████████████████▀');
					this.add('c|@Genesect|/me tips fedora');
				} else {
					sentences = ["(ง ͠ ͠° ͟ل͜ ͡°)ง sᴏᴜɴᴅs ᴅᴏɴɢᴇʀᴏᴜs... ɪᴍ ɪɴ (ง ͠ ͠° ͟ل͜ ͡°)ง", 'http://pastebin.com/8r0jgDd7 become a mod today!'];
					this.add('c|@Genesect|' + this.sample(sentences));
				}
			}
			if (name === 'hippopotas') {
				this.add('-message', '@Hippopotas\'s Sand Stream whipped up a sandstorm!');
			}
			if (name === 'hydroimpact') {
				this.add('c|@HYDRO IMPACT|Think about the name first and then the Pokemon. Look beyond the "simple" detail.');
			}
			if (name === 'innovamania') {
				sentences = ['Don\'t take this seriously', 'These Black Glasses sure look cool', 'Ready for some fun?( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°'];
				this.add('c|@innovamania|' + this.sample(sentences));
			}
			if (name === 'jac') {
				this.add('c|@Jac|YAAAAAAAAAAAAAAAS');
			}
			if (name === 'jinofthegale') {
				this.add('c|@jin of the gale|' + this.sample(['3...2...1... LET IT RIP!', 'My bit-beast is going to eat you alive!']));
			}
			if (name === 'kostitsynkun') {
				this.add('c|@Kostitsyn-kun|Kyun ★ Kyun~');
			}
			if (name === 'kupo') {
				this.add('c|@kupo|abc!');
			}
			if (name === 'lawrenceiii') {
				this.add('c|@Lawrence III|Give me all of your virgin maidens.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|Enter stage left');
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``And believe me I am still alive.``');
				this.add('c|@LegitimateUsername|``I\'m doing Science and I\'m still alive.``');
				this.add('c|@LegitimateUsername|``I feel FANTASTIC and I\'m still alive.``');
				this.add('c|@LegitimateUsername|``While you\'re dying I\'ll be still alive.``');
				this.add('c|@LegitimateUsername|``And when you\'re dead I will be still alive.``');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|Happiness and rainbows, hurrah!');
			}
			if (name === 'lyto') {
				sentences = ["This is divine retribution!", "I will handle this myself!", "Let battle commence!"];
				this.add('c|@Lyto|' + this.sample(sentences));
			}
			if (name === 'marty') {
				this.add('c|@Marty|Prepare yourself.');
			}
			if (name === 'morfent') {
				this.add('c|@Morfent|``──────▀█████▄──────▲``');
				this.add('c|@Morfent|``───▄███████████▄──◀█▶``');
				this.add('c|@Morfent|``─────▄████▀█▄──────█``');
				this.add('c|@Morfent|``───▄█████████████████▄  - I``');
				this.add('c|@Morfent|``─▄█████.▼.▼.▼.▼.▼.▼.▼   - cast``');
				this.add('c|@Morfent|``▄███████▄.▲.▲.▲.▲.▲.▲   - magic``');
				this.add('c|@Morfent|``█████████████████████▀▀ - shitpost``');
			}
			if (name === 'naniman') {
				this.add('c|@Nani Man|rof');
			}
			if (name === 'phil') {
				this.add('c|@phil|GET SLUGGED');
			}
			if (name === 'qtrx') {
				sentences = ["cutie are ex", "q-trix", "quarters", "cute T-rex", "Qatari", "random letters", "spammy letters", "asgdf"];
				this.add('c|@qtrx|omg DONT call me \'' + this.sample(sentences) + '\' pls respect my name its very special!!1!');
			}
			if (name === 'queez') {
				this.add('c|@Queez|B-be gentle');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|Get Rekeri\'d :]');
			}
			if (name === 'relados') {
				let italians = {'haunter': 1, 'test2017': 1, 'uselesstrainer': 1};
				if (toId(pokemon.side.foe.active[0].name) in italians) {
					this.add('c|@Relados|lol italians');
				} else {
					sentences = ['lmfao why are you even playing this game', 'and now, to unleash screaming temporal doom', 'rof'];
					this.add('c|@Relados|' + this.sample(sentences));
				}
			}
			if (name === 'reverb') {
				this.add('c|@Reverb|How is this legal?');
			}
			if (name === 'rosiethevenusaur') {
				sentences = ['!dt party', 'Are you Wifi whitelisted?', 'Read the roomintro!'];
				this.add('c|@RosieTheVenusaur|' + this.sample(sentences));
			}
			if (name === 'scalarmotion') {
				this.add('-message', 'sraclrlamtio got prmotd to driier');
			}
			if (name === 'scotteh') {
				this.add('c|@Scotteh|─────▄▄████▀█▄');
				this.add('c|@Scotteh|───▄██████████████████▄');
				this.add('c|@Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼');
			}
			if (name === 'shamethat') {
				sentences = ['no guys stop fighting', 'mature people use their words', 'please direct all attacks to user: beowulf'];
				this.add('c|@Shame That|' + this.sample(sentences));
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|\\_$-_-$_/');
			}
			if (name === 'spydreigon') {
				sentences = ['curry consumer', 'try to keep up', 'fucking try to knock me down', 'Sometimes I slather myself in vasoline and pretend I\'m a slug', 'I\'m really feeling it!'];
				this.add('c|@Spydreigon|' + this.sample(sentences));
			}
			if (name === 'steamroll') {
				if (!pokemon.isLead) {
					sentences = ['You\'re in for it now!', 'Welcome to a new world of pain!', 'This is going to be **__fun__**...', 'Awesome! Imma deck you in the shnoz!'];
					this.add('c|@Steamroll|' + this.sample(sentences));
				} else {
					pokemon.isLead = false;
				}
			}
			if (name === 'steeledges') {
				sentences = ["In this moment, I am euphoric. Not because of any phony god's blessing. But because, I am enlightened by my own intelligence.", "Potent Potables for $200, Alex."];
				this.add('c|@SteelEdges|' + this.sample(sentences));
			}
			if (name === 'temporaryanonymous') {
				sentences = ['Hey, hey, can I gently scramble your insides (just for laughs)? ``hahahaha``', 'check em', 'If you strike me down, I shall become more powerful than you can possibly imagine! I have a strong deathrattle effect and I cannot be silenced!'];
				this.add('c|@Temporaryanonymous|' + this.sample(sentences));
			}
			if (name === 'test2017') {
				let quacks = '';
				let count = 0;
				do {
					count++;
					quacks = quacks + 'QUACK!';
				} while (this.randomChance(2, 3) && count < 15);
				this.add('c|@Test2017|' + quacks);
			}
			if (name === 'tfc') {
				sentences = ['Here comes the king', ' this chat sucks', 'Coronis smells'];
				this.add('c|@TFC|' + this.sample(sentences));
			}
			if (name === 'tgmd') {
				this.add('c|@TGMD|I\'m a dog :]');
			}
			if (name === 'timbuktu') {
				this.add('c|@Timbuktu|plot twist');
			}
			if (name === 'trickster') {
				this.add('c|@Trickster|' + this.sample(['I do this for free, you know.', 'Believe in the me that believes in you!']));
			}
			if (name === 'trinitrotoluene') {
				this.add('c|@trinitrotoluene|pls no hax');
			}
			if (name === 'waterbomb') {
				this.add('c|@WaterBomb|Get off my lawn! *shakes cane*');
			}
			if (name === 'xfix') {
				let hazards = {stealthrock: 1, spikes: 1, toxicspikes: 1, stickyweb: 1};
				let hasHazards = false;
				for (let hazard in hazards) {
					if (pokemon.side.getSideCondition(hazard)) {
						hasHazards = true;
						break;
					}
				}
				if (hasHazards) {
					this.add('c|@xfix|(no haz... too late)');
				} else {
					this.add('c|@xfix|(no hazards, attacks only, final destination)');
				}
			}
			if (name === 'zdrup') {
				this.add('c|@zdrup|Wait for it...');
			}
			if (name === 'zebraiken') {
				pokemon.phraseIndex = this.random(3);
				//  Zeb's faint and entry phrases correspond to each other.
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Zebraiken|bzzt n_n');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Zebraiken|bzzt *_*');
				} else {
					this.add('c|@Zebraiken|bzzt o_o');
				}
			}

			// Drivers.
			if (name === 'aelita') {
				this.add('c|%Aelita|Transfer: Aelita. Scanner: Aelita. Virtualization!');
			}
			if (name === 'arcticblast') {
				sentences = ['BEAR MY ARCTIC BLAST', 'lmao what kind of team is this', 'guys guys guess what?!?!?!?!', 'Double battles are completely superior to single battles.', 'I miss the days when PS never broke 100 users and all the old auth were still around.'];
				this.add('c|%Arcticblast|' + this.sample(sentences));
			}
			if (name === 'articuno') {
				sentences = ['Don\'t hurt me, I\'m a gril!', '/me quivers **violently**', 'Don\'t make me use my ban whip...'];
				this.add('c|%Articuno|' + this.sample(sentences));
			}
			if (name === 'astara') {
				this.add('c|%Ast☆arA|I\'d rather take a nap, I hope you won\'t be a petilil shit, Eat some rare candies and get on my level.');
			}
			if (name === 'asty') {
				this.add('c|%Asty|:^) Top kek');
			}
			if (name === 'birkal') {
				this.add('c|%Birkal|caw');
			}
			if (name === 'bloobblob') {
				this.add('c|%bloobblob|Contract?');
			}
			if (name === 'charlescarmichael') {
				this.add('c|%Charles Carmichael|If Taylor Swift were in a Fast and Furious movie, it’d be called Taylor Drift.');
			}
			if (name === 'crestfall') {
				sentences = ['On wings of night.', 'Let us hunt those who have fallen to darkness.'];
				this.add('c|%Crestfall|' + this.sample(sentences));
			}
			if (name === 'feliburn') {
				this.add('c|%Feliburn|Come on!');
			}
			if (name === 'galbia') {
				this.add('c|%galbia|prepare for my beautiful display of pure italian skill');
			}
			if (name === 'hugendugen') {
				this.add('c|%Hugendugen|4-1-0 let\'s go for it');
			}
			if (name === 'jellicent') {
				this.add('c|%Jellicent|~(^.^)~');
			}
			if (name === 'kayo') {
				this.add('c|%Kayo|The One and Only Obese Phantom Enthusiast');
			}
			if (name === 'ljdarkrai') {
				this.add('c|%LJDarkrai|Azideias');
			}
			if (name === 'majorbling') {
				sentences = ['(ゞ๑⚈ ˳̫⚈๑) ♡', 'If you can\'t win contests as well as battles, your team is bad~ <3', '♡ Dedenne is too cute to KO ♡'];
				this.add('c|%Majorbling|' + this.sample(sentences));
			}
			if (name === 'raseri') {
				this.add('c|%raseri|ban prinplup');
			}
			if (name === 'quotecs') {
				this.add('c|%QuoteCS|Yeah, I know what you mean, but unfortunately I lack good answers to those because of my incredibly dry personality.');
			}
			if (name === 'uselesstrainer') {
				sentences = ['huehuehuehue', 'PIZA', 'SPAGUETI', 'RAVIOLI RAVIOLI GIVE ME THE FORMUOLI', 'get ready for PUN-ishment'];
				this.add('c|%useless trainer|' + this.sample(sentences));
			}
			if (name === 'vacate') {
				this.add('c|%Vacate|sticky situation');
			}

			// Voices.
			if (name === 'aldaron') {
				this.add('c|+Aldaron|indefatigable workhorse');
			}
			if (name === 'bmelts') {
				this.add('c|+bmelts|zero post hero');
			}
			if (name === 'cathy') {
				let foe = toId(pokemon.side.foe.active[0].name);
				if (foe === 'greatsage' && !this.convoPlayed) {
					this.add('-message', '<~GreatSage> from my observation, it appears that most romantic partners occupy their discussions with repetitive declarations and other uninteresting content');
					this.add('-message', '<&Cathy> lol');
					this.add('-message', '<&Cathy> sounds dull');
					this.add('-message', '<~GreatSage> i do not believe i have ever observed romantic partners discuss any consequential matters (e.g. mathematics, science, or other topics of intellectual interest)');
					this.add('-message', '<~GreatSage> the "normal social protocol" of romance has always presented as exceptionally absurd to me');
					this.add('-message', '<&Cathy> which aspects are you referring to?');
					this.add('-message', '<~GreatSage> it is rather difficult to summarize them in phrases');
					this.add('-message', '<~GreatSage> it\'s not something i have investigated with any thoroughness');
					this.convoPlayed = true;
				} else {
					switch (foe) {
					case 'bmelts':
						sentence = this.sample(['attacks bmelts with a heavy dosage of fun', 'destroys bmelts with an ion ray of fun times']);
						break;
					case 'snowflakes':
						sentence = 'pounces on Snowflakes with a surplus of humour';
						break;
					case 'mikel':
						sentence = 'crushes mikel with patent hilarity';
						break;
					case 'hugendugen':
						sentence = 'skewers Hugendugen with the sword of fun';
						break;
					case 'limi':
						sentence = 'devastates Limi with the fun cannon';
						break;
					}
				}
				if (sentence) {
					this.add('c|HappyFunTimes|/me ' + sentence);
				} else if (!this.convoPlayed) {
					this.add('c|+Cathy|Trivial.');
				}
			}
			if (toId(pokemon.side.foe.active[0].name) === 'cathy') {
				if (name === 'greatsage' && !this.convoPlayed) {
					this.add('-message', '<~GreatSage> from my observation, it appears that most romantic partners occupy their discussions with repetitive declarations and other uninteresting content');
					this.add('-message', '<&Cathy> lol');
					this.add('-message', '<&Cathy> sounds dull');
					this.add('-message', '<~GreatSage> i do not believe i have ever observed romantic partners discuss any consequential matters (e.g. mathematics, science, or other topics of intellectual interest)');
					this.add('-message', '<~GreatSage> the "normal social protocol" of romance has always presented as exceptionally absurd to me');
					this.add('-message', '<&Cathy> which aspects are you referring to?');
					this.add('-message', '<~GreatSage> it is rather difficult to summarize them in phrases');
					this.add('-message', '<~GreatSage> it\'s not something i have investigated with any thoroughness');
					this.convoPlayed = true;
				} else {
					switch (name) {
					case 'bmelts':
						sentence = this.sample(['attacks bmelts with a heavy dosage of fun', 'destroys bmelts with an ion ray of fun times']);
						break;
					case 'snowflakes':
						sentence = 'pounces on Snowflakes with a surplus of humour';
						break;
					case 'mikel':
						sentence = 'crushes mikel with patent hilarity';
						break;
					case 'hugendugen':
						sentence = 'skewers Hugendugen with the sword of fun';
						break;
					case 'limi':
						sentence = 'devastates Limi with the fun cannon';
						break;
					}
					if (sentence) this.add('c|HappyFunTimes|/me ' + sentence);
				}
			}
			if (name === 'diatom') {
				this.add('-message', pokemon.side.foe.name + ' was banned by Diatom. (you should be thankful you are banned and not permabanned)');
			}
			if (name === 'mattl') {
				this.add('c|+MattL|The annoyance I will cause is not well-defined.');
			}
			if (name === 'shaymin') {
				this.add('c|+shaymin|Ready for hax?');
			}
			if (name === 'somalia') {
				this.add('c|+SOMALIA|stupidest shit ever');
			}
			if (name === 'talktakestime') {
				this.add('c|+TalkTakesTime|Welcome to BoTTT!');
			}
		},
		// Here we deal with some special mechanics due to custom sets and moves.
		onBeforeMove(pokemon, target, move) {
			let name = toId(pokemon.name);
			// Special Shaymin forme change.
			if (name === 'shaymin' && !pokemon.illusion) {
				let targetSpecies = (move.category === 'Status') ? 'Shaymin' : 'Shaymin-Sky';

				if (targetSpecies !== pokemon.template.species) {
					this.add('message', pokemon.name + ((move.category === 'Status') ? ' has reverted to Land Forme!' : ' took to the sky once again!'));
					pokemon.formeChange(this.getTemplate(targetSpecies));
					let template = pokemon.template;
					pokemon.baseTemplate = template;
					pokemon.setAbility(template.abilities['0']);
					pokemon.baseAbility = template.ability;
					pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
					this.add('detailschange', pokemon, pokemon.details);
				}
			}

			// Break the secondary of Dell's sig if an attack is attempted.
			if (target && target.volatiles['parry'] && move.category !== 'Status') {
				target.removeVolatile('parry');
			}

			if (pokemon.volatiles['needles']) {
				let dice = this.random(3);
				pokemon.removeVolatile('needles');
				if (dice === 2) {
					this.boost({atk: 1, spe: 1, def: -1}, pokemon, pokemon, 'used needles');
				} else if (dice === 1) {
					this.boost({def: 1, spd: 1, spe: -1}, pokemon, pokemon, 'used needles');
				} else {
					this.boost({atk: 1, def: 1, spe: -1}, pokemon, pokemon, 'used needles');
				}
			}

			if (move.id === 'judgment' && name === 'shrang' && !pokemon.illusion) {
				if (pokemon.setType(['Dragon', 'Fairy'])) {
					this.add('-start', pokemon, 'typechange', 'Dragon/Fairy', '[silent]');
				}
			}
		},
		// Add here salty tears, that is, custom faint phrases.
		onFaint(pokemon) {
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
			let name = toId(pokemon.name);
			let sentences = [];
			let sentence = '';

			// Admins.
			if (name === 'antar') {
				this.add('c|~Antar|Should\'ve been an Umbreon.');
			}
			if (name === 'chaos') {
				if (name === toId(pokemon.name)) this.add('c|~chaos|//forcewin chaos');
				if (this.randomChance(1, 1000)) {
					// Shouldn't happen much, but if this happens it's hilarious.
					this.add('c|~chaos|actually');
					this.add('c|~chaos|//forcewin ' + pokemon.side.name);
					this.win(pokemon.side);
				}
			}
			if (name === 'haunter') {
				this.add('c|~haunter|you can\'t compare with my powers');
			}
			if (name === 'jasmine') {
				this.add('c|~Jasmine|' + this.sample(['I meant to do that.', 'God, I\'m the worse digimon.']));
			}
			if (name === 'joim') {
				sentences = ['AVENGE ME, KIDS! AVEEEENGEEE MEEEEEE!!', '``This was a triumph, I\'m making a note here: HUGE SUCCESS.``', '``Remember when you tried to kill me twice? Oh how we laughed and laughed! Except I wasn\'t laughing.``', '``I\'m not even angry, I\'m being so sincere right now, even though you broke my heart and killed me. And tore me to pieces. And threw every piece into a fire.``'];
				this.add('c|~Joim|' + this.sample(sentences));
			}
			if (name === 'theimmortal') {
				this.add('c|~The Immortal|Oh how wrong we were to think immortality meant never dying.');
			}
			if (name === 'v4') {
				this.add('c|~V4|' + this.sample(['Back to irrevelance for now n_n', 'Well that was certainly a pleasant fall.']));
			}
			if (name === 'zarel') {
				this.add('c|~Zarel|your mom');
				// Followed by the usual '~Zarel fainted'.
				this.add('-message', '~Zarel used your mom!');
			}

			// Leaders.
			if (name === 'hollywood') {
				this.add('c|&hollywood|BibleThump');
			}
			if (name === 'jdarden') {
				this.add('c|&jdarden|;-;7');
			}
			if (name === 'okuu') {
				this.add("raw|<div class=\"broadcast-blue\"><b>...and Smooth Jazz.</b></div>");
			}
			if (name === 'sirdonovan') {
				this.add('-message', 'RIP sirDonovan');
			}
			if (name === 'slayer95') {
				this.add('c|&Slayer95|I may be defeated this time, but that is irrevelant in the grand plot of seasonals!');
			}
			if (name === 'sweep') {
				this.add('c|&Sweep|xD');
			}
			if (name === 'verbatim') {
				this.add('c|&verbatim|Crash and Burn');
			}

			// Mods.
			if (name === 'acedia') {
				this.add('c|@Acedia|My dad smoked his whole life. One day my mom told him "If you want to see your children graduate, you have to stop". 3 years later he died of lung cancer. My mom told me "Dont smoke; dont put your family through this". At 24, I have never touched a cigarette. I must say, I feel a sense of regret, because watching you play Pokemon gave me cancer anyway ( ͝° ͜ʖ͡°)');
			}
			if (name === 'am') {
				this.add('c|@AM|RIP');
			}
			if (name === 'antemortem') {
				this.add('c|@antemortem|FUCKING CAMPAIGNERS');
			}
			if (name === 'ascriptmaster') {
				this.add('c|@Ascriptmaster|Too overpowered. I\'m nerfing you next patch');
			}
			if (name === 'asgdf') {
				this.add('c|@asgdf|' + this.sample(['Looks like I spoke too hasteely', 'You only won because I couldn\'t think of a penguin pun!']));
			}
			if (name === 'audiosurfer') {
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Audiosurfer|No? Well you should check it out.');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Audiosurfer|You should consider Battling 101 friend.');
				} else {
					this.add('c|@Audiosurfer|Back to catching waves.');
				}
			}
			if (name === 'barton') {
				this.add('c|@barton|' + this.sample(['ok', 'haha?']));
			}
			if (name === 'bean') {
				sentences = ['that\'s it ur getting banned', 'meow', '(✖╭╮✖)'];
				this.add('c|@bean|' + this.sample(sentences));
			}
			if (name === 'beowulf') {
				this.add('c|@Beowulf|There is no need to be mad');
			}
			if (name === 'biggie') {
				sentences = ['It was all a dream', 'It\'s gotta be the shoes', 'ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ'];
				this.add('c|@BiGGiE|' + this.sample(sentences));
			}
			if (name === 'blitzamirin') {
				this.add('c|@Blitzamirin| The Mirror Can Lie It Doesn\'t Show What\'s Inside! ╰〳~ ✖ Д ✖ ~〵⊃━☆ﾟ.*･｡ﾟ');
			}
			if (name === 'businesstortoise') {
				this.add('c|@Business Tortoise|couldn\'t meet my deadline...');
			}
			if (name === 'coolstorybrobat') {
				switch (pokemon.phraseIndex) {
				case 1:
					sentence = "Lol I got slayed";
					break;
				case 2:
					sentence = "BRUH...";
					break;
				case 3:
					sentence = "I tried";
					break;
				case 4:
					sentence = "Going back to those mountains to train brb";
					break;
				default:
					sentence = "I forgot what fruit had... tasted like...";
				}
				this.add('c|@CoolStoryBrobat|' + sentence);
			}
			if (name === 'dell') {
				this.add('c|@Dell|All because I couldn\'t use Yoshi...');
				this.add('c|@Dell|───────────────████─███────────');
				this.add('c|@Dell|──────────────██▒▒▒█▒▒▒█───────');
				this.add('c|@Dell|─────────────██▒────────█──────');
				this.add('c|@Dell|─────────██████──██─██──█──────');
				this.add('c|@Dell|────────██████───██─██──█──────');
				this.add('c|@Dell|────────██▒▒▒█──────────███────');
				this.add('c|@Dell|────────██▒▒▒▒▒▒───▒──██████───');
				this.add('c|@Dell|───────██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███─');
				this.add('c|@Dell|──────██▒▒▒▒─────▒▒▒▒▒▒▒▒▒▒▒▒█─');
				this.add('c|@Dell|──────██▒▒▒───────▒▒▒▒▒▒▒█▒█▒██');
				this.add('c|@Dell|───────██▒▒───────▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|────────██▒▒─────█▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|────────███▒▒───██▒▒▒▒▒▒▒▒▒▒▒▒█');
				this.add('c|@Dell|─────────███▒▒───█▒▒▒▒▒▒▒▒▒▒▒█─');
				this.add('c|@Dell|────────██▀█▒▒────█▒▒▒▒▒▒▒▒██──');
				this.add('c|@Dell|──────██▀██▒▒▒────█████████────');
				this.add('c|@Dell|────██▀███▒▒▒▒────█▒▒██────────');
				this.add('c|@Dell|█████████▒▒▒▒▒█───██──██───────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒█────████▒▒█──────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒▒█───███▒▒▒█──────');
				this.add('c|@Dell|█▒▒▒▒▒▒█▒▒▒▒▒█────█▒▒▒▒▒█──────');
				this.add('c|@Dell|██▒▒▒▒▒█▒▒▒▒▒▒█───█▒▒▒███──────');
				this.add('c|@Dell|─██▒▒▒▒███████───██████────────');
				this.add('c|@Dell|──██▒▒▒▒▒██─────██─────────────');
				this.add('c|@Dell|───██▒▒▒██─────██──────────────');
				this.add('c|@Dell|────█████─────███──────────────');
				this.add('c|@Dell|────█████▄───█████▄────────────');
				this.add('c|@Dell|──▄█▓▓▓▓▓█▄─█▓▓▓▓▓█▄───────────');
				this.add('c|@Dell|──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────');
				this.add('c|@Dell|──█▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓█──────────');
				this.add('c|@Dell|──▀████████▀▀███████▀──────────');
			}
			if (name === 'eeveegeneral') {
				this.add('c|@Eevee General|' + this.sample(['Retreat!', 'You may have won the battle, but you haven\'t won the war!', 'I salute you o7']));
			}
			if (name === 'electrolyte') {
				this.add('c|@Electrolyte|just wait till I hit puberty...');
			}
			if (name === 'enguarde') {
				this.add('c|@Enguarde|I let my guard down...');
			}
			if (name === 'eos') {
				this.add('c|@EoS|؍༼ಥ_ಥ༽ጋ');
			}
			if (name === 'formerhope') {
				this.add('c|@Former Hope|This is why we can\'t have nice things.');
			}
			if (name === 'genesect') {
				if (pokemon.phraseIndex === 5 || pokemon.phraseIndex === 3 || pokemon.phraseIndex === 1) {
					this.add('-message', '▄████▄░░░░░░░░░░░░░░░░░░░░');
					this.add('-message', '██████▄░░░░░░▄▄▄░░░░░░░░░░');
					this.add('-message', '░███▀▀▀▄▄▄▀▀▀░░░░░░░░░░░░░');
					this.add('-message', '░░░▄▀▀▀▄░░░█▀▀▄░▄▀▀▄░█▄░█░');
					this.add('-message', '░░░▄▄████░░█▀▀▄░█▄▄█░█▀▄█░');
					this.add('-message', '░░░░██████░█▄▄▀░█░░█░█░▀█░');
					this.add('-message', '░░░░░▀▀▀▀░░░░░░░░░░░░░░░░░');
				} else if (pokemon.phraseIndex === 4) {
					this.add('c|@Genesect|Well, if that\'s what you want');
					this.add('c|@Genesect|┬┴┬┴┤ʕ•ᴥ├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤ ʕ•├┬┴┬┴');
					this.add('c|@Genesect|┬┴┬┴┤  ʕ├┬┴┬┴');
				} else {
					sentences = ["The darkside cannot be extinguished, when you fight...", "؍༼ಥ_ಥ༽ጋ lament your dongers ؍༼ಥ_ಥ༽ጋ", "Yᵒᵘ Oᶰˡʸ Lᶤᵛᵉ Oᶰᶜᵉ", "やれやれだぜ", " ୧༼ಠ益ಠ༽୨ MRGLRLRLR ୧༼ಠ益ಠ༽୨"].randomize();
					this.add('c|@Genesect|' + sentences[0]);
				}
			}
			if (name === 'hippopotas') {
				this.add('-message', 'The sandstorm subsided.');
			}
			if (name === 'hydroimpact') {
				this.add('c|@HYDRO IMPACT|Well done, you\'ve gone beyond your limits and have gained my trust. Now go and write your own destiny, don\'t let fate write it for you.');
			}
			if (name === 'innovamania') {
				sentences = ['Did you rage quit?', 'How\'d you lose with this set?', 'Pm Nani Man to complain about this set ( ͡° ͜ʖ ͡°)'];
				this.add('c|@innovamania|' + this.sample(sentences));
			}
			if (name === 'jac') {
				this.add('c|@Jac|bruh');
			}
			if (name === 'jinofthegale') {
				sentences = ['ヽ༼ຈل͜ຈ༽ﾉ You\'ve upped your game ヽ༼ຈل͜ຈ༽ﾉ?', 'Please don\'t steal my bit-beast!', 'Should have used Black'];
				this.add('c|@jin of the gale|' + this.sample(sentences));
			}
			if (name === 'kostitsynkun') {
				this.add('c|@Kostitsyn-kun|Kyun ★ Kyun~');
			}
			if (name === 'kupo') {
				this.add('c|@kupo|:C');
			}
			if (name === 'lawrenceiii') {
				this.add('c|@Lawrence III|Fuck off.');
			}
			if (name === 'layell') {
				this.add('c|@Layell|' + this.sample(['Alas poor me', 'Goodnight sweet prince']));
			}
			if (name === 'legitimateusername') {
				this.add('c|@LegitimateUsername|``This isn\'t brave. It\'s murder. What did I ever do to you?``');
			}
			if (name === 'level51') {
				this.add('c|@Level 51|You made me sad. That\'s the opposite of happy.');
			}
			if (name === 'lyto') {
				this.add('c|@Lyto|' + this.sample(['Unacceptable!', 'Mrgrgrgrgr...']));
			}
			if (name === 'marty') {
				this.add('c|@Marty|Your fate is sealed');
			}
			if (name === 'morfent') {
				sentences = ['Hacking claims the lives of over 2,000 registered laddering alts every day.', 'Every 60 seconds in Africa, a minute passes. Together we can stop this. Please spread the word.', 'SOOOOOO $TONED FUCK MAN AW $HIT NIGGA HELLA MOTHER FUCKING 666 ODD FUTURE MAN BRO CHECK THIS OUT MY SWAG WITH THE WHAT WHOLE 666 420 $$$$ HOLLA HOLLA GET DOLLA SWED CASH FUCKING MARIJUANA CIGARETTES GANGSTA GANGSTA EAZY-E C;;R;E;A;M; SO BAKED OFF THE BOBMARLEY GANJA 420 SHIT PURE OG KUUSSHHH LEGALIZE CRYSTAL WEED'];
				this.add('c|@Morfent|' + this.sample(sentences));
			}
			if (name === 'naniman') {
				sentences = ['rof', "deck'd", '**praise** TI'];
				this.add('c|@Nani Man|' + this.sample(sentences));
			}
			if (name === 'phil') {
				this.add('c|@phil|The salt is real right now');
			}
			if (name === 'qtrx') {
				sentences = ['Keyboard not found; press **Ctrl + W** to continue...', 'hfowurfbiEU;DHBRFEr92he', 'At least my name ain\t asgdf...'];
				this.add('c|@qtrx|' + this.sample(sentences));
			}
			if (name === 'queez') {
				this.add('c|@Queez|(◕‿◕✿)');
			}
			if (name === 'rekeri') {
				this.add('c|@rekeri|lucky af :[');
			}
			if (name === 'relados') {
				sentences = ['BS HAX', 'rekt', 'rof'];
				this.add('c|@Relados|' + this.sample(sentences));
			}
			if (name === 'reverb') {
				this.add('c|@Reverb|stupid communist dipshit');
			}
			if (name === 'rosiethevenusaur') {
				this.add('c|@RosieTheVenusaur|' + this.sample(['SD SKARM SHALL LIVE AGAIN!!!', 'Not my WiFi!']));
			}
			if (name === 'scalarmotion') {
				this.add('-message', 'scalarmotion was banned by Nani Man. (spangj)');
			}
			if (name === 'scotteh') {
				this.add('-message', '▄███████▄.▲.▲.▲.▲.▲.▲');
				this.add('-message', '█████████████████████▀▀');
			}
			if (name === 'shamethat') {
				sentences = ["ok agree to disagree", "rematch, don't attack this time", "i blame beowulf"];
				this.add('c|@Shame That|' + this.sample(sentences));
			}
			if (name === 'skitty') {
				this.add('c|@Skitty|!learn skitty, roleplay');
				this.add('raw|<div class="infobox">Skitty <span class="message-learn-cannotlearn">can\'t</span> learn Role Play</div>');
			}
			if (name === 'spydreigon') {
				sentences = ['lolhax', 'crit mattered', 'bruh cum @ meh', '>thinking Pokemon takes any skill'];
				this.add('c|@Spydreigon|' + this.sample(sentences));
			}
			if (name === 'steamroll') {
				if (!pokemon.killedSome) {
					sentence = 'Goddamn I feel useless.';
				} else {
					sentences = ['...And I saw, as it were... Spaghetti.', "Agh, shouldn't of been that easy.", 'Hope that was enough.'];
					sentence = this.sample(sentences);
				}
				this.add('c|@Steamroll|' + sentence);
			}
			if (name === 'steeledges') {
				this.add('c|@SteelEdges|' + this.sample(['You know, I never really cared for Hot Pockets.', 'Suck it, Trebek. Suck it long, and suck it hard.']));
			}
			if (name === 'temporaryanonymous') {
				sentences = [';_;7', 'This kills the tempo', 'I\'m kill. rip.', 'S-senpai! Y-you\'re being too rough! >.<;;;;;;;;;;;;;;;;;', 'A-at least you checked my dubs right?', 'B-but that\'s impossible! This can\'t be! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHGH'];
				this.add('c|@Temporaryanonymous|' + this.sample(sentences));
			}
			if (name === 'test2017') {
				sentences = ['DUCK YOU!', 'GO DUCK YOURSELF!', 'SUCK MY DUCK!'];
				this.add('c|@Test2017|' + this.sample(sentences));
			}
			if (name === 'tfc') {
				this.add('c|@TFC|' + this.sample(sentences));
			}
			if (name === 'tgmd') {
				this.add('c|@TGMD|rip in pepsi');
			}
			if (name === 'timbuktu') {
				this.add('c|@Timbuktu|' + this.sample(sentences));
			}
			if (name === 'trickster') {
				sentences = ['RIP in pepperoni cappuccino pistachio.', 'El psy congroo.', 'W-wow! Hacker!', '“This guy\'s team is CRAZY!” ☑ “My team can\'t win against a team like that” ☑ "He NEEDED precisely those two crits to win" ☑ “He led with the only Pokemon that could beat me” ☑ "He got the perfect hax" ☑ “There was nothing I could do” ☑ “I played that perfectly”', '(⊙﹏⊙✿)'];
				this.add('c|@Trickster|' + this.sample(sentences));
			}
			if (name === 'trinitrotoluene') {
				this.add('c|@trinitrotoluene|why hax @_@');
			}
			if (name === 'waterbomb') {
				this.add('c|@WaterBomb|brb getting more denture cream');
			}
			if (name === 'xfix') {
				let foe = pokemon.side.foe.active[0];
				if (foe.name === '@xfix') {
					this.add('c|@xfix|(annoying Dittos...)');
				} else if (foe.ability === 'magicbounce') {
					this.add('c|@xfix|(why ' + foe.name + ' has Magic Bounce...)');
					this.add('c|@xfix|(gg... why...)');
				} else {
					this.add('c|@xfix|(gg... I guess)');
				}
			}
			if (name === 'zdrup') {
				this.add('c|@zdrup|... keep waiting for it ...');
			}
			if (name === 'zebraiken') {
				if (pokemon.phraseIndex === 2) {
					this.add('c|@Zebraiken|bzzt u_u');
				} else if (pokemon.phraseIndex === 1) {
					this.add('c|@Zebraiken|bzzt ._.');
				} else {
					// Default faint.
					this.add('c|@Zebraiken|bzzt x_x');
				}
			}

			// Drivers.
			if (name === 'aelita') {
				sentences = ['Oh no, the Scyphozoa\'s here!', 'Devirtualized...', 'Stones. Aelita Stones. Like the rock group. I\'m Odd\'s cousin from Canada.'];
				this.add('c|%Aelita|' + this.sample(sentences));
			}
			if (name === 'arcticblast') {
				sentences = ['totally had it but choked, gg', 'I would have won if it weren\'t for HAX', 'oh', 'Double battles are stil superior to single battles.', 'newfag'];
				this.add('c|%Arcticblast|' + this.sample(sentences));
			}
			if (name === 'articuno') {
				sentences = ['This is why you don\'t get any girls.', 'fite me irl', 'Actually, I don\'t have a gender...'];
				this.add('c|%Articuno|' + this.sample(sentences));
			}
			if (name === 'astara') {
				sentences = ['/me twerks into oblivion', 'good night ♥', 'Astara Vista Baby'];
				this.add('c|%Ast☆arA|' + this.sample(sentences));
			}
			if (name === 'asty') {
				this.add('c|%Asty|:^( Bottom kek');
			}
			if (name === 'birkal') {
				this.add('c|%Birkal|//birkal');
			}
			if (name === 'bloobblob') {
				this.add('c|%bloobblob|I won\'t die! Even if I\'m killed!');
			}
			if (name === 'charlescarmichael') {
				this.add('c|%Charles Carmichael|The Grandmaster of Puns will be back for revenge!');
			}
			if (name === 'crestfall') {
				this.add('c|%Crestfall|Vayne [All Chat]: Outplayed me gg no re');
			}
			if (name === 'feliburn') {
				this.add('c|%Feliburn|' + this.sample(['BHUWUUU!', 'I like shorts! They\'re comfy and easy to wear!']));
			}
			if (name === 'galbia') {
				this.add('c|%galbia|' + this.sample(['azz e mo', 'rip luck :(']));
			}
			if (name === 'jellicent') {
				this.add('c|%Jellicent|X_X');
			}
			if (name === 'kayo') {
				this.add('c|%Kayo|Fat ShOoOoOoSty!');
			}
			if (name === 'ljdarkrai') {
				this.add('c|%LJDarkrai|:<');
			}
			if (name === 'majorbling') {
				this.add('c|%Majorbling|There is literally no way to make this pokemon good...(ゞ๑T  ˳̫T\'๑) ');
			}
			if (name === 'raseri') {
				this.add('c|%raseri|banned');
			}
			if (name === 'quotecs') {
				this.add('c|%QuoteCS|#StillIrrelevant');
			}
			if (name === 'uselesstrainer') {
				sentences = ['MATTERED', 'CAIO', 'ima repr0t', 'one day i\'ll turn into a beautiful butterfly'];
				this.add('c|%useless trainer|' + this.sample(sentences));
			}
			if (name === 'vacate') {
				this.add('c|%Vacate|dam it');
			}

			// Ex-staff or honorary voice.
			if (name === 'bmelts') {
				this.add('c|+bmelts|retired now');
			}
			if (name === 'cathy') {
				this.add('c|+Cathy|I was being facetious');
			}
			if (name === 'diatom' && !pokemon.hasBeenThanked) {
				this.add('c|★' + pokemon.side.foe.name + '|Thanks Diatom...');
			}
			if (name === 'mattl') {
				this.add('c|+MattL|Finish him! You used "Finals week!" Fatality!');
			}
			if (name === 'redew') {
				this.add('c|+Redew|i hope u think ur a good player');
				this.add('c|+Redew|play spl man');
				this.add('c|+Redew|ud win lots');
			}
			if (name === 'shaymin') {
				this.add('c|+shaymin|You\'ve done well, perhaps...too well, even beating the odds!');
			}
			if (name === 'somalia') {
				this.add('c|+SOMALIA|tired of this shitass game');
			}
			if (name === 'talktakestime') {
				this.add('-message', '(Automated response: Your battle contained a banned outcome.)');
			}
		},
		// Special switch-out events for some mons.
		onSwitchOut(pokemon) {
			if (toId(pokemon.name) === 'hippopotas' && !pokemon.illusion) {
				this.add('-message', 'The sandstorm subsided.');
			}
			// Shaymin forme change.
			if (toId(pokemon.name) === 'shaymin' && !pokemon.illusion) {
				if (pokemon.template.species === 'Shaymin') {
					pokemon.formeChange(this.getTemplate('Shaymin-Sky'));
					let template = pokemon.template;
					pokemon.baseTemplate = template;
					pokemon.setAbility(template.abilities['0']);
					pokemon.baseAbility = template.ability;
					pokemon.details = template.species + (pokemon.level === 100 ? '' : ', L' + pokemon.level) + (pokemon.gender === '' ? '' : ', ' + pokemon.gender) + (pokemon.set.shiny ? ', shiny' : '');
				}
			}

			// Transform
			if (pokemon.originalName) pokemon.name = pokemon.originalName;
		},
		onDragOut(pokemon) {
			// Prevents qtrx from being red carded by chaos while in the middle of using sig move, which causes a visual glitch.
			if (pokemon.isDuringAttack) {
				this.add('-message', "But the Unown Aura absorbed the effect!");
				return null;
			}
			if (pokemon.kupoTransformed) {
				pokemon.name = '@kupo';
				pokemon.kupoTransformed = false;
			}
		},
		onAfterMoveSelf(source, target, move) {
			// Make haunter not immune to Life Orb as a means to balance.
			if (toId(source.name) === 'haunter') {
				this.damage(source.maxhp / 10, source, source, this.getItem('lifeorb'));
			}
		},
		onDisableMove(pokemon) {
			let name = toId(pokemon.name);
			// Enforce choice item locking on custom moves.
			// qtrx only has one move anyway. This isn't implemented for Cathy since her moves are all custom. Don't trick her a Scarf!
			if (name !== 'qtrx' && name !== 'Cathy') {
				let moves = pokemon.moveSlots;
				if (pokemon.getItem().isChoice && pokemon.lastMove && pokemon.lastMove.id === moves[3].id) {
					for (let i = 0; i < 3; i++) {
						if (!moves[i].disabled) {
							pokemon.disableMove(moves[i].id, false);
						}
					}
				}
			}
			// Enforce taunt disabling custom moves.
			if (pokemon.volatiles['taunt']) {
				let moves = pokemon.moveSlots;
				for (let i = 0; i < moves.length; i++) {
					if (this.getMove(moves[i].id).category === 'Status' && !moves[i].disabled) {
						pokemon.disableMove(moves[i].id, false);
						moves[i].disabled = true;
					}
				}
			}
		},
		// Specific residual events for custom moves.
		// This allows the format to have kind of custom side effects and volatiles.
		onResidual(battle) {
			for (let s in battle.sides) {
				let thisSide = battle.sides[s];
				if (thisSide.premonTimer > 4) {
					thisSide.premonTimer = 0;
					thisSide.premonEffect = true;
				} else if (thisSide.premonTimer > 0) {
					if (thisSide.premonTimer === 4) thisSide.addSideCondition('safeguard');
					thisSide.premonTimer++;
				}
				for (let p in thisSide.active) {
					let pokemon = thisSide.active[p];
					let name = toId(pokemon.name);

					if (pokemon.side.premonEffect) {
						pokemon.side.premonEffect = false;
						this.add('c|@zdrup|...dary! __**LEGENDARY!**__');
						this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1, accuracy: 1}, pokemon, pokemon, 'legendary premonition');
						pokemon.addVolatile('aquaring');
						pokemon.addVolatile('focusenergy');
					}
					if (pokemon.volatiles['resilience'] && !pokemon.fainted) {
						this.heal(pokemon.maxhp / 16, pokemon, pokemon);
						this.add('-message', pokemon.name + "'s resilience healed itself!");
					}
					if (pokemon.volatiles['unownaura'] && !pokemon.fainted && !pokemon.illusion) {
						this.add('-message', "Your keyboard is reacting to " + pokemon.name + "'s Unown aura!");
						if (this.randomChance(1, 2)) {
							this.useMove('trickroom', pokemon);
						} else {
							this.useMove('wonderroom', pokemon);
						}
					}
					if (name === 'beowulf' && !pokemon.fainted && !pokemon.illusion) {
						this.add('c|@Beowulf|/me buzzes loudly!');
					}
					if (name === 'cathy' && !pokemon.fainted && !pokemon.illusion) {
						let messages = [
							'kicking is hilarious!',
							'flooding the chat log with kicks makes me lol',
							'please don\'t stop me from having fun',
							'having fun is great!',
							'isn\'t this so much fun?',
							'let\'s all have fun by spamming the channel!',
							'FUN FUN FUN',
							'SO MUCH FUN!',
							'^_^ fun times ^_^',
							'/me is having so much fun!',
							'having fun is great!',
							'/me thinks spam is fun!',
							'/me loves spamming this channel, because it\'s completely inconsequential!',
							'this is just the internet -- nothing matters!',
							'let\'s have fun ALL NIGHT LONG!!!!!!!!!!!!!!!!!!!!!!',
						];
						this.add('c|HappyFunTimes|' + this.sample(messages));
					}
					if (pokemon.volatiles['parry']) {
						// Dell hasn't been attacked.
						pokemon.removeVolatile('parry');
						this.add('-message', "Untouched, the Aura Parry grows stronger still!");
						this.boost({def: 1, spd: 1}, pokemon, pokemon, 'Aura Parry');
					}
				}
			}
		},
		// This is where the signature moves are actually done.
		onModifyMove(move, pokemon) {
			// This is to make signature moves work when transformed.
			if (move.id === 'transform') {
				move.onHit = function (target, pokemon) {
					if (!pokemon.transformInto(target, pokemon)) return false;
					pokemon.originalName = pokemon.name;
					pokemon.name = target.name;
				};
			}

			let name = toId(pokemon.illusion && move.sourceEffect === 'allyswitch' ? pokemon.illusion.name : pokemon.name);
			// Prevent visual glitch with Spell Steal.
			move.effectType = 'Move';
			// Just because it's funny.
			if (move.id === 'defog') {
				move.name = 'Defrog';
				this.attrLastMove('[still]');
				this.add('-anim', pokemon, "Defog", pokemon);
			}

			// Admin signature moves.
			if (move.id === 'spikes' && name === 'antar') {
				move.name = 'Firebomb';
				move.basePower = 100;
				move.category = 'Special';
				move.flags = {};
				move.type = 'Fire';
				move.onTryHitSide = function (side, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Overheat", side.active[0]);
				};
			}
			if (move.id === 'embargo' && name === 'chaos') {
				move.name = 'Forcewin';
				move.onHit = function (pokemon) {
					pokemon.addVolatile('taunt');
					pokemon.addVolatile('torment');
					pokemon.addVolatile('confusion');
					pokemon.addVolatile('healblock');
				};
			}
			if (move.id === 'quiverdance' && name === 'haunter') {
				move.name = 'Genius Dance';
				move.boosts = {spd: 1, spe: 1, accuracy: 2, evasion: -1, def: -1};
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['haunterino']) return false;
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['haunterino']) return false;
					pokemon.addVolatile('haunterino');
				};
			}
			if (move.id === 'bellydrum' && name === 'jasmine') {
				move.name = 'Lockdown';
				move.onHit = function (target, pokemon) {
					this.add("raw|<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
				};
				move.self = {boosts: {atk: 6}};
			}
			if (move.id === 'milkdrink' && name === 'joim') {
				move.name = 'Red Bull Drink';
				move.boosts = {spa: 1, spe: 1, accuracy: 1, evasion: -1};
				delete move.heal;
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['redbull']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Geomancy", pokemon);
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['redbull']) return false;
					pokemon.addVolatile('redbull');
				};
			}
			if (move.id === 'sleeptalk' && name === 'theimmortal') {
				move.name = 'Sleep Walk';
				move.pp = 20;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Healing Wish", target);
				};
				move.onHit = function (pokemon) {
					if (pokemon.status !== 'slp') {
						if (pokemon.hp >= pokemon.maxhp) return false;
						if (!pokemon.setStatus('slp')) return false;
						pokemon.statusData.time = 3;
						pokemon.statusData.startTime = 3;
						this.heal(pokemon.maxhp);
						this.add('-status', pokemon, 'slp', '[from] move: Rest');
					}
					let moves = pokemon.moveSlots.map(moveData => moveData.id).filter(moveId => moveId !== 'sleeptalk');
					let move = '';
					if (moves.length) move = this.sample(moves);
					if (!move) return false;
					this.useMove(move, pokemon);
					let activate = false;
					let boosts = {};
					for (let i in pokemon.boosts) {
						if (pokemon.boosts[i] < 0) {
							activate = true;
							boosts[i] = 0;
						}
					}
					if (activate) pokemon.setBoost(boosts);
					if (!pokemon.informed) {
						this.add('c|~The Immortal|I don\'t really sleep walk...');
						pokemon.informed = true;
					}
				};
			}
			if (move.id === 'vcreate' && name === 'v4') {
				move.name = 'V-Generate';
				move.self = {boosts: {accuracy: -2}};
				move.accuracy = 85;
				move.secondaries = [{chance: 50, status: 'brn'}];
			}
			if (move.id === 'relicsong' && name === 'zarel') {
				move.name = 'Relic Song Dance';
				move.basePower = 60;
				move.multihit = 2;
				move.category = 'Special';
				move.type = 'Psychic';
				move.negateSecondary = true;
				move.ignoreImmunity = true;
				delete move.secondaries;
				move.onTryHit = function (target, pokemon) {
					this.attrLastMove('[still]');
					let move = pokemon.template.speciesid === 'meloettapirouette' ? 'Brick Break' : 'Relic Song';
					this.add('-anim', pokemon, move, target);
				};
				move.onHit = function (target, pokemon, move) {
					if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
						this.add('-formechange', pokemon, 'Meloetta', '[msg]');
					} else if (pokemon.formeChange('Meloetta-Pirouette')) {
						this.add('-formechange', pokemon, 'Meloetta-Pirouette', '[msg]');
						// Modifying the move outside of the ModifyMove event? BLASPHEMY
						move.category = 'Physical';
						move.type = 'Fighting';
					}
				};
				move.onAfterMove = function (pokemon) {
					// Ensure Meloetta goes back to standard form after using the move
					if (pokemon.template.speciesid === 'meloettapirouette' && pokemon.formeChange('Meloetta')) {
						this.add('-formechange', pokemon, 'Meloetta', '[msg]');
					}
				};
			}

			// Leader signature moves.
			if (move.id === 'geomancy' && name === 'hollywood') {
				move.name = 'Meme Mime';
				move.flags = {};
				move.onTry = function () {};
				move.boosts = {atk: 1, def: 1, spa: 1, spd: 1, spe: 1, accuracy: 1};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Geomancy", pokemon);
				};
			}
			if (move.id === 'dragontail' && name === 'jdarden') {
				move.name = 'Wyvern\'s Wind';
				if (!move.flags) move.flags = {};
				move.flags['sound'] = 1;
				move.type = 'Flying';
				move.category = 'Special';
				move.basePower = 80;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Boomburst", target);
				};
			}
			if (move.id === 'firespin' && name === 'okuu') {
				move.name = 'Blazing Star - Ten Evil Stars';
				move.basePower = 60;
				move.accuracy = true;
				move.type = 'Fire';
				move.priority = 2;
				move.status = 'brn';
				move.self = {boosts: {spa: -1}};
				move.onHit = function (target, source) {
					let oldAbility = target.setAbility('solarpower');
					if (oldAbility) {
						this.add('-ability', target, target.ability, '[from] move: Blazing Star - Ten Evil Stars');
					}
				};
			}
			if (move.id === 'mefirst' && name === 'sirdonovan') {
				move.name = 'Ladies First';
				move.category = 'Special';
				move.type = 'Fairy';
				move.basePower = 120;
				move.accuracy = 100;
				move.self = {boosts: {spe: 1}};
				move.onHit = function (target, pokemon) {
					let decision = this.willMove(pokemon);
					if (decision && target.gender === 'F') {
						this.cancelMove(pokemon);
						this.queue.unshift(decision);
						this.add('-activate', pokemon, 'move: Ladies First');
					}
				};
			}
			if (move.id === 'allyswitch' && name === 'slayer95') {
				move.name = 'Spell Steal';
				move.target = 'self';
				move.onTryHit = function (target, source) {
					if (!source.illusion) {
						this.add('-fail', source);
						this.add('-hint', "Spell Steal only works behind an Illusion!");
						return null;
					}
				};
				move.onHit = function (target, source) {
					let lastMove = source.illusion.moveSlots[source.illusion.moves.length - 1];
					this.useMove(lastMove.id, source);
				};
			}
			if (move.id === 'kingsshield' && name === 'sweep') {
				move.name = "Sweep's Shield";
				move.onHit = function (pokemon) {
					pokemon.setAbility('swiftswim');
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'superfang' && name === 'vacate') {
				move.name = 'Duper Fang';
				move.basePower = 105;
				delete move.damageCallback;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Super Fang", target);
				};
				move.onHit = function (pokemon) {
					if (this.randomChance(95, 100)) {
						pokemon.trySetStatus('par');
					} else {
						pokemon.addVolatile('confusion');
					}
				};
			}
			if (move.id === 'bravebird' && name === 'verbatim') {
				move.name = 'Glass Cannon';
				move.basePower = 170;
				move.accuracy = 80;
				move.recoil = [1, 4];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "High Jump Kick", target);
				};
				move.onHit = function (pokemon) {
					this.add('c|&verbatim|DEFENESTRATION!');
					if (this.randomChance(1, 20)) pokemon.switchFlag = true;
				};
				move.onMoveFail = function (target, source, move) {
					this.damage(source.maxhp / 2, source, source, 'glasscannon');
				};
			}

			// Mod signature moves.
			if (move.id === 'worryseed' && name === 'acedia') {
				move.name = 'Procrastination';
				move.onHit = function (pokemon, source) {
					let oldAbility = pokemon.setAbility('slowstart');
					if (oldAbility) {
						this.add('-ability', pokemon, 'Slow Start', '[from] move: Procrastination');
						if (this.randomChance(1, 10)) source.faint();
						return;
					}
					return false;
				};
			}
			if (move.id === 'pursuit' && name === 'am') {
				move.name = 'Predator';
				move.basePowerCallback = function (pokemon, target) {
					if (target.beingCalledBack) return 120;
					return 60;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Pursuit", target);
				};
				move.boosts = {atk: -1, spa: -1, accuracy: -2};
			}
			if (move.id === 'triattack' && name === 'ascriptmaster') {
				move.name = 'Spectrum Beam';
				move.ignoreImmunity = true;
				move.basePower = 8;
				move.critRatio = 1;
				move.accuracy = 95;
				move.typechart = Object.keys(Dex.data.TypeChart);
				move.hitcount = 0;
				move.type = move.typechart[0];
				move.multihit = move.typechart.length;
				delete move.secondaries;
				move.onPrepareHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Swift", target);
				};
				move.onHit = function (target, source, move) {
					move.hitcount++;
					move.type = move.typechart[move.hitcount];
				};
			}
			if (move.id === 'drainingkiss' && name === 'antemortem') {
				move.name = 'Postmortem';
				move.basePower = 110;
				move.accuracy = 85;
				delete move.drain;
				// Manually activate the ability again.
				if (pokemon.ability === 'sheerforce') {
					delete move.secondaries;
					move.negateSecondary = true;
					pokemon.addVolatile('sheerforce');
				} else {
					move.secondaries = [{chance: 50, self: {boosts: {spa: 1, spe: 1}}}];
				}
			}
			if (move.id === 'futuresight' && name === 'asgdf') {
				move.name = 'Obscure Pun';
				// It's easier onHit since it's a future move.
				// Otherwise, all of onTryHit must be rewritten here to add the drop chance.
				move.onHit = function (pokemon) {
					this.add('-message', 'I get it now!');
					if (this.randomChance(7, 10)) {
						this.boost({spa: -1, spd: -1}, pokemon, pokemon, move.sourceEffect);
					}
				};
			}
			if (move.id === 'detect' && name === 'audiosurfer') {
				move.name = 'Audioshield';
				move.secondary = {chance: 50, self: {boosts: {accuracy: -1}}};
				move.onTryHit = function (target) {
					this.add('-anim', target, "Boomburst", target);
					return !!this.willAct() && this.runEvent('StallMove', target);
				};
				move.onHit = function (pokemon) {
					let foe = pokemon.side.foe.active[0];
					if (foe.ability !== 'soundproof') {
						this.add('-message', 'The Audioshield is making a deafening noise!');
						this.damage(foe.maxhp / 12, foe, pokemon);
						if (this.randomChance(1, 2)) this.boost({atk: -1, spa: -1}, foe, foe, 'noise damage');
					}
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'bulkup' && name === 'barton') {
				move.name = 'MDMA Huff';
				move.boosts = {atk: 2, spe: 1, accuracy: -1};
			}
			if (move.id === 'glare' && name === 'bean') {
				move.name = 'Coin Toss';
				move.accuracy = true;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Pay Day", target);
				};
				move.onHit = function (pokemon) {
					pokemon.addVolatile('confusion');
				};
				move.ignoreImmunity = true;
				move.type = 'Dark';
			}
			if (move.id === 'bugbuzz' && name === 'beowulf') {
				move.name = 'Buzzing of the Swarm';
				move.category = 'Physical';
				move.basePower = 100;
				move.secondaries = [{chance: 10, volatileStatus: 'flinch'}];
			}
			if (move.id === 'dragontail' && name === 'biggie') {
				move.name = 'Food Rush';
				move.basePower = 100;
				move.type = 'Normal';
				move.self = {boosts: {evasion: -1}};
			}
			if (move.id === 'quickattack' && name === 'birkal') {
				move.name = 'Caw';
				move.type = '???';
				move.category = 'Status';
				move.onHit = function (target) {
					if (!target.setType('Bird')) return false;
					this.add('-start', target, 'typechange', 'Bird');
					this.add('c|%Birkal|caw');
				};
			}
			if (move.id === 'oblivionwing' && name === 'blitzamirin') {
				move.name = 'Pneuma Relinquish';
				move.type = 'Ghost';
				move.damageCallback = function (pokemon, target) {
					return target.hp / 2;
				};
				move.onImmunity = function (type) {
					if (type in {'Normal': 1, 'Ghost': 1}) return false;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Roar of Time", target);
				};
				move.onHit = function (pokemon) {
					pokemon.addVolatile('gastroacid');
				};
			}
			if (move.id === 'bravebird' && name === 'coolstorybrobat') {
				move.name = 'Brave Bat';
				move.basePower = 130;
				move.critRatio = 2;
				delete move.recoil;
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Brave Bird", target);
				};
			}
			if (move.id === 'detect' && name === 'dell') {
				let dmg = Math.ceil(pokemon.maxhp / (pokemon.ability === 'simple' ? 2 : 4));
				move.name = 'Aura Parry';
				move.self = {boosts: {atk: 1, spa: 1, spe: 1}};
				move.onTryHit = function (target, source) {
					if (source.hp <= dmg) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Amnesia", source);
					return !!this.willAct() && this.runEvent('StallMove', target);
				};
				move.onHit = function (target) {
					this.directDamage(dmg, target, target);
					pokemon.addVolatile('parry');
					pokemon.addVolatile('stall');
				};
			}
			if (name === 'eeveegeneral') {
				if (move.id === 'shiftgear') {
					move.name = 'Gears of War';
				}
				if (move.id === 'quickattack') {
					move.name = 'War Crimes';
					move.type = 'Normal';
					move.category = 'Status';
					move.basePower = 0;
					move.onHit = function (pokemon, source) {
						this.directDamage(source.maxhp / 4, source, source);
						pokemon.addVolatile('curse');
						pokemon.addVolatile('confusion');
						this.add("c|@Eevee General|What's a Geneva Convention?");
					};
				}
			}
			if (name === 'electrolyte') {
				if (move.id === 'entrainment') {
					move.name = 'Study';
					move.priority = 1;
					move.flags = {protect: 1};
					move.onTryHit = function (target, source) {
						if (source.lastAttackType === 'None') {
							this.add('-hint', "Study only works when preceded by an attacking move.");
							return false;
						}
					};
					move.onHit = function (target, source) {
						let possibleTypes = [];
						let attackType = source.lastAttackType;
						source.lastAttackType = 'None';
						for (let type in this.data.TypeChart) {
							if (target.hasType(type)) continue;
							let typeCheck = this.data.TypeChart[type].damageTaken[attackType];
							if (typeCheck === 1) {
								possibleTypes.push(type);
							}
						}
						if (!possibleTypes.length) {
							return false;
						}
						let targetType = this.sample(possibleTypes);
						if (!target.setType(targetType)) {
							return false;
						}
						this.add('c|@Electrolyte|Ha! I\'ve found your weakness.');
						this.add('-start', target, 'typechange', targetType);
					};
				} else {
					pokemon.lastAttackType = move.type;
				}
			}
			if (move.id === 'fakeout' && name === 'enguarde') {
				move.name = 'Ready Stance';
				move.type = 'Steel';
				move.secondaries = [{chance: 100, boosts: {atk: -1, spa: -1}, volatileStatus: 'flinch'}];
				move.onTryHit = function (target, source) {
					if (source.activeTurns > 1) {
						this.add('-hint', "Ready Stance only works on your first turn out.");
						return false;
					}
				};
				move.onHit = function (target, source) {
					source.addVolatile('focusenergy');
					this.add('c|@Enguarde|En garde!'); // teehee
				};
			}
			if (move.id === 'shadowball' && name === 'eos') {
				move.name = 'Shadow Curse';
				move.power = 60;
				move.priority = 1;
				move.volatileStatus = 'curse';
				move.onHit = function (target, source) {
					this.directDamage(source.maxhp / 2, source, source);
				};
			}
			if (move.id === 'roleplay' && name === 'formerhope') {
				move.volatileStatus = 'taunt';
				move.self = {boosts: {spa: 1}};
				move.onTryHit = function (target, source) {
					this.add('c|@Former Hope|/me godmodes');
				};
				move.onHit = function () {};
			}
			if (move.id === 'geargrind' && name === 'genesect') {
				move.name = "Grind you're mum";
				move.basePower = 30;
				move.onHit = function (target, pokemon) {
					if (target.fainted || target.hp <= 0) this.boost({atk: 2, spa: 2, spe: 1}, pokemon, pokemon, move);
				};
			}
			if (move.id === 'partingshot' && name === 'hippopotas') {
				move.name = 'Hazard Pass';
				delete move.boosts;
				move.onHit = function (pokemon) {
					let hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'].randomize();
					pokemon.side.addSideCondition(hazards[0]);
					pokemon.side.addSideCondition(hazards[1]);
				};
			}
			if (move.id === 'hydrocannon' && name === 'hydroimpact') {
				move.name = 'HYDRO IMPACT';
				move.basePower = 150;
				move.accuracy = 90;
				move.category = 'Physical';
				move.status = 'brn';
				delete move.self;
				move.onHit = function (target, source) {
					this.directDamage(source.maxhp * 0.35, source, source);
				};
			}
			if (move.id === 'splash' && name === 'innovamania') {
				move.name = 'Rage Quit';
				delete move.onTryHit;
				move.onHit = function (pokemon) {
					pokemon.faint();
				};
			}
			if (move.id === 'crunch' && name === 'jas61292') {
				move.name = 'Minus One';
				move.basePower = 110;
				move.accuracy = 85;
				delete move.secondary;
				delete move.secondaries;
				move.onHit = function (pokemon, source) {
					let boosts = {};
					boosts[this.sample(['atk', 'def', 'spa', 'spd'])] = -1;
					this.boost(boosts, pokemon, source);
				};
			}
			if (move.id === 'rapidspin' && name === 'jinofthegale') {
				move.name = 'Beyblade';
				move.category = 'Special';
				move.type = 'Electric';
				move.basePower = 90;
				// If we use onHit but use source, we don't have to edit self.onHit.
				move.onHit = function (pokemon, source) {
					let side = source.side;
					for (let i = 0; i < side.pokemon.length; i++) {
						side.pokemon[i].status = '';
					}
					this.add('-cureteam', source, '[from] move: Beyblade');
				};
			}
			if (move.id === 'refresh' && name === 'kostitsynkun') {
				move.name = 'Kawaii-desu uguu~';
				move.heal = [1, 2];
				move.flags = {heal: 1};
				move.onHit = function (target, source) {
					this.add('-curestatus', source, source.status);
					source.status = '';
					source.removeVolatile('confusion');
					source.removeVolatile('curse');
					source.removeVolatile('attract');
					if (this.randomChance(1, 7)) {
						pokemon.side.foe.active[0].addVolatile('attract');
					}
				};
			}
			if (move.id === 'transform' && name === 'kupo') {
				move.name = 'Kupo Nuts';
				move.flags = {};
				move.priority = 2;
				move.onHit = function (pokemon, user) {
					let template = pokemon.template;
					if (pokemon.fainted || pokemon.illusion) {
						return false;
					}
					if (!template.abilities || (pokemon && pokemon.transformed) || (user && user.transformed)) {
						return false;
					}
					if (!user.formeChange(template, user)) {
						return false;
					}
					user.transformed = true;
					user.types = pokemon.types;
					user.addedType = pokemon.addedType;
					for (let statName in user.stats) {
						user.stats[statName] = pokemon.stats[statName];
					}
					user.moveSlots = [];
					for (let i = 0; i < pokemon.moveSlots.length; i++) {
						let move = this.getMove(user.set.moves[i]);
						let moveData = pokemon.moveSlots[i];
						let moveName = moveData.move;
						if (moveData.id === 'hiddenpower') {
							moveName = 'Hidden Power ' + user.hpType;
						}
						user.moveSlots.push({
							move: moveName,
							id: moveData.id,
							pp: move.noPPBoosts ? moveData.maxpp : 5,
							maxpp: move.noPPBoosts ? moveData.maxpp : 5,
							target: moveData.target,
							disabled: false,
						});
					}
					for (let j in pokemon.boosts) {
						user.boosts[j] = pokemon.boosts[j];
					}
					this.add('-transform', user, pokemon);
					user.setAbility(pokemon.ability);
					user.originalName = user.name;
					user.name = pokemon.name;
				};
			}
			if (move.id === 'gust' && name === 'lawrenceiii') {
				move.name = 'Shadow Storm';
				move.type = '???'; // Shadow
				move.accuracy = true;
				move.ignoreDefensive = true;
				move.defensiveCategory = 'Physical';
				move.basePowerCallback = function (pokemon, target) {
					if (target.volatiles['partiallytrapped']) return 65;
					return 35;
				};
				move.onEffectiveness = function (typeMod, target, type, move) {
					let eff = 1;
					if (toId(pokemon.side.foe.active[0].name) === 'lawrenceiii') eff = -1;
					return eff; // Shadow moves are SE against all non-Shadow mons.
				};
				move.onHit = function (target, source) {
					if (target.volatiles['partiallytrapped'] && (this.randomChance(35, 100))) {
						target.addVolatile('confusion');
					}
				};
			}
			if (move.id === 'shellsmash' && name === 'legitimateusername') {
				move.name = 'Shell Fortress';
				move.boosts = {def: 2, spd: 2, atk: -4, spa: -4, spe: -4};
			}
			if (move.id === 'trumpcard' && name === 'level51') {
				move.name = 'Next Level Strats';
				delete move.basePowerCallback;
				move.target = 'self';
				move.category = 'Status';
				move.onTryHit = function (pokemon) {
					if (pokemon.level >= 200) return false;
				};
				move.onHit = function (pokemon) {
					pokemon.level += 9;
					if (pokemon.level > 200) pokemon.level = 200;
					this.add('-message', 'Level 51 advanced 9 levels! It is now level ' + pokemon.level + '!');
				};
			}
			if (move.id === 'thundershock' && name === 'lyto') {
				move.name = 'Gravity Storm';
				move.basePower = 100;
				move.accuracy = 100;
				delete move.secondary;
				delete move.secondaries;
				move.self = {volatileStatus: 'magnetrise'};
			}
			if (move.id === 'protect' && name === 'layell') {
				move.name = 'Pixel Protection';
				move.self = {boosts: {def: 3, spd: 2}};
				move.onTryHit = function (pokemon) {
					if (pokemon.volatiles['pixels']) {
						this.add('-hint', "Pixel Protection only works once per outing.");
						return false;
					}
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Moonblast", pokemon);
					return !!this.willAct() && this.runEvent('StallMove', pokemon);
				};
				move.onHit = function (pokemon) {
					if (pokemon.volatiles['pixels']) return false;
					pokemon.addVolatile('pixels');
					pokemon.addVolatile('stall');
				};
			}
			if (move.id === 'sacredfire' && name === 'marty') {
				move.name = 'Immolate';
				move.basePower += 20;
				move.category = 'Special';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Flamethrower", target);
				};
			}
			if (move.id === 'spikes' && name === 'morfent') {
				move.name = 'Used Needles';
				move.self = {boosts: {evasion: -1}};
				move.target = 'normal';
				move.onTryHit = function (target, source) {
					source.addVolatile('needles');
				};
			}
			if (name === 'naniman') {
				if (move.id === 'fireblast') {
					move.name = 'Tanned';
					move.accuracy = 100;
					move.secondaries = [{status: 'brn', chance: 100}];
					move.onTryHit = function (target, source, move) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Eruption", target);
					};
					move.onHit = function (target, source) {
						this.boost({atk: 1, spa: 1, evasion: -1, accuracy: -1}, source, source);
					};
				} else if (move.id === 'topsyturvy') {
					move.name = 'rof';
				}
			}
			if (move.id === 'inferno' && name === 'nixhex') {
				move.name = 'Beautiful Disaster';
				move.type = 'Normal';
				move.secondaries = [{
					chance: 100,
					onHit(target, source) {
						if (this.randomChance(1, 2)) {
							target.trySetStatus('brn', source);
						} else {
							target.trySetStatus('par', source);
						}
					},
				}];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
			}
			if (move.id === 'hypnosis' && name === 'osiris') {
				move.name = 'Restless Sleep';
				move.accuracy = 85;
				move.volatileStatus = 'nightmare';
			}
			if (move.id === 'whirlpool' && name === 'phil') {
				move.name = 'Slug Attack';
				move.basePower = 50;
				move.secondaries = [{chance: 100, status: 'tox'}];
			}
			if (move.id === 'meditate' && name === 'qtrx') {
				move.name = 'KEYBOARD SMASH';
				move.target = 'normal';
				move.boosts = null;
				move.hitcount = this.sample([3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7]);
				move.onPrepareHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Fairy Lock", target);
					this.add('-anim', pokemon, "Fairy Lock", pokemon); // DRAMATIC FLASHING
				};
				move.onHit = function (target, source) {
					let gibberish = '';
					let hits = 0;
					let hps = ['hiddenpowerbug', 'hiddenpowerdark', 'hiddenpowerdragon', 'hiddenpowerelectric', 'hiddenpowerfighting', 'hiddenpowerfire', 'hiddenpowerflying', 'hiddenpowerghost', 'hiddenpowergrass', 'hiddenpowerground', 'hiddenpowerice', 'hiddenpowerpoison', 'hiddenpowerpsychic', 'hiddenpowerrock', 'hiddenpowersteel', 'hiddenpowerwater'];
					this.add('c|@qtrx|/me slams face into keyboard!');
					source.isDuringAttack = true; // Prevents the user from being kicked out in the middle of using Hidden Powers.
					for (let i = 0; i < move.hitcount; i++) {
						if (target.hp !== 0) {
							let len = 16 + this.random(35);
							gibberish = '';
							for (let j = 0; j < len; j++) gibberish += String.fromCharCode(48 + this.random(79));
							this.add('-message', gibberish);
							this.useMove(this.sample(hps), source, target);
							hits++;
						}
					}
					this.add('-message', 'Hit ' + hits + ' times!');
					source.isDuringAttack = false;
				};
			}
			if (move.id === 'leer' && name === 'queez') {
				move.name = 'Sneeze';
				delete move.boosts;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Curse", target);
				};
				move.onHit = function (target, source) {
					if (!target.volatiles.curse) {
						this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1, accuracy: 1}, source, source);
						target.addVolatile('curse');
					} else {
						this.boost({atk: 1}, source, source);
						this.boost({def: -1}, target, source);
						this.useMove('explosion', source, target);
					}
				};
			}
			if (move.id === 'headcharge' && name === 'rekeri') {
				move.name = 'Land Before Time';
				move.basePower = 125;
				move.type = 'Rock';
				move.accuracy = 90;
				move.secondaries = [{chance: 10, volatileStatus: 'flinch'}];
			}
			if (move.id === 'stockpile' && name === 'relados') {
				move.name = 'Loyalty';
				move.type = 'Fire';
				move.priority = 1;
				delete move.volatileStatus;
				move.onTryHit = function () {
					return true;
				};
				move.onHit = function (target, source) {
					if (!source.volatiles['stockpile'] || (source.volatiles['stockpile'].layers < 3)) {
						source.addVolatile('stockpile');
						this.add("raw|<div class=\"broadcast-blue\"><b>Relados received a loyalty point!</b></div>");
					} else {
						source.removeVolatile('stockpile');
						this.add("raw|<div class=\"broadcast-red\"><b>Relados was rewarded for his loyalty!</b><br />Relados has advanced one level.</div>");
						source.level++;
						source.formeChange('Terrakion');
						source.details = source.species + (source.level === 99 ? '' : ', L' + source.level + 1);
						this.add('detailschange', source, source.details);
						this.heal(source.maxhp, source, source);
					}
					this.add('-clearallboost');
					for (let i = 0; i < this.sides.length; i++) {
						if (this.sides[i].active[0]) this.sides[i].active[0].clearBoosts();
					}
				};
			}
			if (move.id === 'eggbomb' && name === 'reverb') {
				move.name = 'fat monkey';
				move.accuracy = 95;
				move.flags = {contact: 1, protect: 1};
				move.self = {boosts: {def: -1, spe: -1}};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Brave Bird", target);
				};
				move.onHit = function (target, source) {
					this.heal(120, source, source);
				};
				move.onMoveFail = function (target, source, move) {
					this.directDamage(120, source, source);
				};
			}
			if (move.id === 'frenzyplant' && name === 'rosiethevenusaur') {
				move.name = 'Swag Plant';
				move.volatileStatus = 'confusion';
				move.self = {boosts: {atk: 1, def: 1}};
			}
			if (move.id === 'icebeam' && name === 'scalarmotion') {
				move.name = 'Eroding Frost';
				move.basePower = 65;
				move.onEffectiveness = function (typeMod, type) {
					if (type in {'Fire': 1, 'Water': 1}) return 1;
				};
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Blizzard", target);
				};
			}
			if (move.id === 'boomburst' && name === 'scotteh') {
				move.name = 'Geomagnetic Storm';
				move.type = 'Electric';
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Discharge", target);
				};
			}
			if (move.id === 'healingwish' && name === 'shamethat') {
				move.name = 'Extreme Compromise';
			}
			if (move.id === 'judgment' && name === 'shrang') {
				move.name = 'Pixilate';
			}
			if (move.id === 'storedpower' && name === 'skitty') {
				move.name = 'Ultimate Dismissal';
				move.type = 'Fairy';
				move.onDamage = function (damage, target, source, effect) {
					if (damage > 0) {
						this.heal(Math.ceil((damage * 0.25) * 100 / target.maxhp), source, source);
					}
				};
			}
			if (move.id === 'thousandarrows' && name === 'snowflakes') {
				move.name = 'Azalea Butt Slam';
				move.category = 'Special';
				move.onHit = function (target, source, move) {
					target.addVolatile('trapped', source, move, 'trapper');
				};
			}
			if (move.id === 'waterpulse' && name === 'spydreigon') {
				move.name = 'Mineral Pulse';
				move.basePower = 95;
				move.type = 'Steel';
				move.accuracy = 100;
			}
			if (name === 'steamroll') {
				if (move.id === 'protect') {
					move.name = 'Conflagration';
					move.onTryHit = function (pokemon) {
						if (pokemon.activeTurns > 1) {
							this.add('-hint', "Conflagration only works on your first turn out.");
							return false;
						}
						this.attrLastMove('[still]');
						this.add('-anim', pokemon, "Fire Blast", pokemon);
					};
					move.self = {boosts: {atk: 2, def: 2, spa: 2, spd: 2, spe: 2}};
				}
				move.onHit = function (target, pokemon) {
					if (target.fainted || target.hp <= 0) pokemon.killedSome = 1;
				};
			}
			if (move.id === 'tailglow' && name === 'steeledges') {
				delete move.boosts;
				move.name = 'True Daily Double';
				move.target = 'normal';
				move.onTryHit = function (target, source) {
					if (source.volatiles['truedailydouble']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Nasty Plot", target);
				};
				move.onHit = function (target, source) {
					if (this.randomChance(1, 2)) {
						this.add('-message', '@SteelEdges failed misserably!');
						this.boost({spa: -2}, source, source);
					} else {
						this.add('-message', '@SteelEdges is the winner!');
						this.boost({spa: 4}, source, source);
					}
					source.addVolatile('truedailydouble');
				};
			}
			if (move.id === 'shadowsneak' && name === 'temporaryanonymous') {
				move.name = 'SPOOPY EDGE CUT';
				move.basePower = 90;
				move.accuracy = 100;
				move.self = {boosts: {evasion: -1}};
				move.onTryHit = function (target, source) {
					this.add('-message', '*@Temporaryanonymous teleports behind you*');
					this.attrLastMove('[still]');
					this.add('-anim', source, "Shadow Force", target);
				};
				move.onHit = function (pokemon) {
					if (pokemon.hp <= 0 || pokemon.fainted) {
						this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *unsheathes glorious cursed nippon steel katana and cuts you in half with it* heh......nothing personnel.........kid......................');
					}
				};
				move.onMoveFail = function (target, source, move) {
					this.add('-message', '*@Temporaryanonymous teleports behind you*');
					this.add('c|@Temporaryanonymous|YOU ARE ALREADY DEAD *misses* Tch......not bad.........kid......................');
				};
			}
			if (name === 'test2017') {
				if (move.id === 'karatechop') {
					move.name = 'Ducktastic';
					move.basePower = 100;
					move.accuracy = 100;
					move.type = 'Normal';
				}
				if (move.id === 'roost') {
					move.onHit = function (pokemon) {
						pokemon.trySetStatus('tox');
					};
				}
			}
			if (move.id === 'drainpunch' && name === 'tfc') {
				move.name = 'Chat Flood';
				move.basePower = 150;
				move.type = 'Water';
				move.category = 'Special';
				move.self = {boosts: {spa: -1, spd: -1, def: -1}};
			}
			if (move.id === 'return' && name === 'tgmd') {
				delete move.basePowerCallback;
				move.name = 'Canine Carnage';
				move.basePower = 120;
				move.secondaries = [{chance: 10, volatileStatus: 'flinch'}, {chance: 100, boosts: {def: -1}}];
				move.accuracy = 90;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Close Combat", target);
				};
			}
			if (move.id === 'rockthrow' && name === 'timbuktu') {
				move.name = 'Geoblast';
				move.type = 'Fire';	// Not the other way round or STAB would be lost.
				move.category = 'Special';
				move.accuracy = true;
				move.basePowerCallback = function (source, target) {
					return (40 * Math.pow(2, source.timesGeoblastUsed));
				};
				move.onEffectiveness = function (typeMod, type, move) {
					return typeMod + this.getEffectiveness('Rock', type);
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Fire Blast", source);
					this.add('-anim', source, "Power Gem", target);
				};
				move.onHit = function (target, source) {
					source.timesGeoblastUsed++;
				};
			}
			if (move.id === 'naturepower' && name === 'trickster') {
				move.name = 'Cometstorm';
				move.category = 'Special';
				move.type = 'Fairy';
				move.basePower = 80;
				move.secondaries = [{chance: 30, status: 'brn'}, {chance: 30, status: 'frz'}];
				move.onEffectiveness = function (typeMod, type, move) {
					return typeMod + this.getEffectiveness('Ice', type);
				};
				move.self = {boosts: {accuracy: -1}};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
				delete move.onHit;
			}
			if (move.id === 'explosion' && name === 'trinitrotoluene') {
				move.name = 'Get Haxed';
				move.basePower = 250;
				move.onTryHit = function (target, source) {
					this.boost({def: -1}, target, source);
				};
				move.onHit = function (pokemon) {
					pokemon.side.addSideCondition('spikes');
					this.add('-message', 'Debris was scattered on ' + pokemon.name + "'s side!");
				};
			}
			if (move.id === 'waterfall' && name === 'waterbomb') {
				move.name = 'Water Bomb';
				move.basePowerCallback = function (pokemon, target) {
					if (this.effectiveWeather() === 'raindance' || this.effectiveWeather() === 'primordialsea') return 93;
					if (this.effectiveWeather() === 'sunnyday' || this.effectiveWeather() === 'desolateland') return 210;
					return 140;
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Seismic Toss", target);
				};
				move.accuracy = true;
				move.ignoreImmunity = true;
				move.ignoreDefensive = true;
				move.ignoreEvasion = true;
				move.ignoreAbility = true;
			}
			if (move.id === 'metronome' && name === 'xfix') {
				if (pokemon.moveSlots[3] && pokemon.moveSlots[3].pp) {
					pokemon.moveSlots[3].pp = Math.round(pokemon.moveSlots[3].pp * 10 + 6) / 10;
				}
				move.name = '(Super Glitch)';
				move.multihit = [2, 5];
				move.onTryHit = function (target, source) {
					if (!source.isActive) return null;
					if (this.randomChance(776, 777)) return;
					let opponent = pokemon.side.foe.active[0];
					opponent.setStatus('brn');
					let possibleStatuses = ['confusion', 'flinch', 'attract', 'focusenergy', 'foresight', 'healblock'];
					for (let i = 0; i < possibleStatuses.length; i++) {
						if (this.randomChance(1, 3)) {
							opponent.addVolatile(possibleStatuses[i]);
						}
					}

					function generateNoise() {
						let noise = '';
						let random = this.random(40, 81);
						for (let i = 0; i < random; i++) {
							if (this.randomChance(3, 4)) {
								// Non-breaking space
								noise += '\u00A0';
							} else {
								noise += String.fromCharCode(this.random(0xA0, 0x3040));
							}
						}
						return noise;
					}
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is frozen solid?)");
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER " + opponent.name + " is hurt by its burn!)");
					this.damage(opponent.maxhp * this.random(42, 96) * 0.01, opponent, opponent);
					let exclamation = source.status === 'brn' ? '!' : '?';
					this.add('-message', "(Enemy " + generateNoise.call(this) + " TMTRAINER @xfix is hurt by its burn" + exclamation + ")");
					this.damage(source.maxhp * this.random(24, 48) * 0.01, source, source);
					return null;
				};
			}
			if (move.id === 'detect' && name === 'zebraiken') {
				move.name = 'bzzt';
				move.self = {boosts: {spa: 1, atk: 1}};
			}
			if (move.id === 'wish' && name === 'zdrup') {
				move.name = 'Premonition';
				move.flags = {};
				move.sideCondition = 'mist';
				move.onTryHit = function (pokemon) {
					if (pokemon.side.premonTimer) {
						this.add('-hint', 'Premonition\'s effect is already underway!');
						return false;
					}
				};
				move.onHit = function (pokemon) {
					pokemon.side.premonTimer = 1;
				};
			}

			// Driver signature moves.
			if (move.id === 'thunder' && name === 'aelita') {
				move.name = 'Energy Field';
				move.accuracy = 100;
				move.basePower = 150;
				move.secondaries = [{chance: 40, status: 'par'}];
				move.self = {boosts: {spa: -1, spd: -1, spe: -1}};
			}
			if (move.id === 'psychoboost' && name === 'arcticblast') {
				move.name = 'Doubles Purism';
				delete move.self;
				move.onHit = function (target, source) {
					if (source.hp) {
						let hasRemovedHazards = false;
						let sideConditions = {'spikes': 1, 'toxicspikes': 1, 'stealthrock': 1, 'stickyweb': 1};
						for (let i in sideConditions) {
							if (target.side.removeSideCondition(i)) {
								hasRemovedHazards = true;
								this.add('-sideend', target.side, this.getEffect(i).name, '[from] move: Doubles Purism', '[of] ' + source);
							}
							if (source.side.removeSideCondition(i)) {
								hasRemovedHazards = true;
								this.add('-sideend', source.side, this.getEffect(i).name, '[from] move: Doubles Purism', '[of] ' + source);
							}
						}
						if (hasRemovedHazards) this.add('c|%Arcticblast|HAZARDS ARE TERRIBLE IN DOUBLES');
					}
				};
			}
			if (move.id === 'whirlwind' && name === 'articuno') {
				move.name = 'True Support';
				move.self = {boosts: {def: 1, spd: 1}};
				move.onHit = function (target, source) {
					this.useMove('substitute', target, target);
				};
			}
			if (move.id === 'toxic' && name === 'asty') {
				move.name = 'Amphibian Toxin';
				move.accuracy = 100;
				move.self = {boosts: {atk: -1, spa: -1}};
				move.boosts = {atk: -1, spa: -1};
				move.onHit = function (target, source) {
					target.side.addSideCondition('toxicspikes');
					target.side.addSideCondition('toxicspikes');
				};
			}
			if (move.id === 'psywave' && name === 'astara') {
				move.name = 'Star Bolt Desperation';
				move.type = this.sample(['???', 'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water']);
				move.damageCallback = function (pokemon) {
					return pokemon.hp * 7 / 8;
				};
				move.onHit = function (target, source) {
					if (this.randomChance(1, 2)) target.addVolatile('confusion');
					let status = this.sample(['par', 'brn', 'frz', 'psn', 'tox', 'slp']);
					if (this.randomChance(1, 2)) target.trySetStatus(status);
					let boosts = {};
					let increase = this.sample(['atk', 'def', 'spa', 'spd', 'spe', 'accuracy']);
					let decrease = this.sample(['atk', 'def', 'spa', 'spd', 'spe', 'accuracy']);
					boosts[increase] = 1;
					boosts[decrease] = -1;
					this.boost(boosts, source, source);
				};
			}
			if (move.id === 'spikecannon' && name === 'bloobblob') {
				// I fear that having two moves with id 'bulletseed' would mess with PP.
				move.name = 'Lava Whip';
				move.type = 'Fire';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Tail Slap", target);
				};
			}
			if (move.id === 'hypervoice' && name === 'bumbadadabum') {
				move.name = 'Open Source Software';
				move.type = 'Electric';
				move.basePower = 110;
				move.accuracy = 95;
				move.secondaries = [{chance: 20, self: {boosts: {spa: -1}}, volatileStatus: 'disable'}];
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Dark Void", target);
				};
				move.onHit = function () {
					this.add('c|%Bumbadadabum|I\'d just like to interject for a moment. What you\'re referring to as Linux, is in fact, GNU/Linux, or as I\'ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.');
				};
			}
			if (move.id === 'swagger' && name === 'charlescarmichael') {
				move.name = 'Bad Pun';
				move.onHit = function (pokemon) {
					pokemon.addVolatile('taunt');
				};
			}
			if (move.id === 'protect' && name === 'crestfall') {
				move.name = 'Final Hour';
				move.onTryHit = function (pokemon) {
					if (pokemon.activeTurns > 1) {
						this.add('-hint', "Final Hour only works on your first turn out.");
						return false;
					}
					this.attrLastMove('[still]');
					this.add('-anim', pokemon, "Dark Pulse", pokemon);
				};
				move.onHit = function () {
					this.add('c|%Crestfall|' + this.sample(['The die is cast...', 'Time for reckoning.']));
				};
				move.self = {boosts: {spe: 2, evasion: 1, def: -2, spd: -2}};
			}
			if (move.id === 'dragonrush' && name === 'dtc') {
				move.name = 'Dragon Smash';
				move.basePower = 150;
				move.recoil = [1, 2];
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Head Charge", target);
				};
			}
			if (name === 'feliburn') {
				if (move.id === 'firepunch') {
					move.name = 'Falcon Punch';
					move.basePower = 150;
					move.accuracy = 85;
					move.self = {boosts: {atk: -1, def: -1, spd: -1}};
					move.onTryHit = function (target, source) {
						this.add('c|%Feliburn|FAALCOOOOOOON');
						this.attrLastMove('[still]');
						this.add('-anim', source, "Fire Punch", target);
					};
					move.onHit = function () {
						this.add('c|%Feliburn|PUUUUUNCH!!');
					};
				}
				if (move.id === 'taunt') {
					move.onHit = function () {
						this.add('c|%Feliburn|Show me your moves!');
					};
				}
			}
			if (move.id === 'highjumpkick' && name === 'galbia') {
				move.name = 'Kibitz';
				move.basePower = 110;
				move.accuracy = 100;
				delete move.onMoveFail;
				move.onHit = function (target, source) {
					let chance = source.hasAbility('serenegrace') ? 60 : 30;
					// 30% or 60% chance for Kibits causing the target to flinch.
					if (this.willMove(target) && this.randomChance(chance, 100)) {
						// Kibitz will flinch the target.
						target.addVolatile('flinch');
					} else if (target.hp !== 0 && !target.newlySwitched) {
						this.damage(source.maxhp / 3, source, source, 'Kibitz');
					}
				};
			}
			if (move.id === 'psychup' && name === 'hugendugen') {
				move.name = 'Policy Decision';
				move.onHit = function (target, source) {
					let targetBoosts = {};
					let targetDeboosts = {};
					for (let i in target.boosts) {
						targetBoosts[i] = target.boosts[i];
						targetDeboosts[i] = -target.boosts[i];
					}
					source.setBoost(targetBoosts);
					target.setBoost(targetDeboosts);
					this.add('-copyboost', source, target, '[from] move: Policy Decision');
					this.add('-invertboost', target, '[from] move: Policy Decision');
				};
			}
			if (move.id === 'surf' && name === 'jellicent') {
				move.name = 'Shot For Shot';
				move.basePower = 80;
				move.volatileStatus = 'confusion';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Teeter Dance", target);
				};
			}
			if (move.id === 'vinewhip' && name === 'kayo') {
				move.name = 'Beard of Zeus Bomb';
				move.type = 'Steel';
				move.basePower = 90;
				move.secondaries = [{
					chance: 50,
					self: {boosts: {atk: 1, spd: 1}},
					onHit(target, source) {
						if (target.gender === 'F') {
							target.addVolatile('attract');
						} else if (target.gender === 'M') {
							target.addVolatile('confusion');
						} else {
							target.trySetStatus('brn');
						}
					},
				}];
				move.onTryHit = function (target, source, move) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Leaf Storm", target);
				};
			}
			if (move.id === 'blazekick' && name === 'ljdarkrai') {
				move.name = 'Blaze Blade';
				move.accuracy = 100;
				move.basePower = 90;
				move.critRatio = 2;
			}
			if (move.id === 'bulletpunch' && name === 'majorbling') {
				move.name = 'Focus Laser';
				move.type = 'Electric';
				move.category = 'Status';
				move.basePower = 0;
				move.self = {volatileStatus: 'torment'};
				move.onTryHit = function (target, source) {
					if (pokemon.activeTurns > 1) {
						this.add('-hint', "Focus Laser only works on your first turn out.");
						return false;
					}
				};
				move.onPrepareHit = function (source, target, move) {
					if (pokemon.activeTurns > 1) {
						return;
					}
					this.add('-message', "%Majorbling's power level is increasing! It's over nine thousand!");
					target.addVolatile('focuspunch');
					this.boost({spa: 2, atk: 2, spe: 2}, target, target);
				};
				move.onHit = function (target, source) {
					this.useMove('discharge', source, target);
					source.removeVolatile('focuspunch');
				};
			}
			if (move.id === 'scald' && name === 'raseri') {
				move.name = 'Ban Scald';
				move.basePower = 150;
				delete move.secondary;
				delete move.secondaries;
				move.status = 'brn';
			}
			if (move.id === 'spikes' && name === 'quotecs') {
				move.name = 'Diversify';
				move.self = {boosts: {atk: 1, spd: 1}};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Eruption", source);
				};
			}
			if (move.id === 'bulletpunch' && name === 'uselesstrainer') {
				move.name = 'Ranting';
				move.type = 'Bug';
				move.basePower = 40;
				move.multihit = [2, 5];
				move.self = {volatileStatus: 'mustrecharge'};
				move.accuracy = 95;
			}

			// Voices signature moves.
			if (move.id === 'superpower' && name === 'aldaron') {
				move.name = 'Admin Decision';
				move.basePower = 80;
				move.self = {boosts: {def: 1, spd: 1, spe: -2}};
				move.onEffectiveness = function () {
					return 1;
				};
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Simple Beam", target);
				};
			}
			if (move.id === 'partingshot' && name === 'bmelts') {
				move.name = "Aaaannnd... he's gone";
				move.type = 'Ice';
				move.category = 'Special';
				move.basePower = 80;
				delete move.boosts;
			}
			if (name === 'cathy') {
				if (move.id === 'kingsshield') {
					move.name = 'Heavy Dosage of Fun';
				}
				if (move.id === 'calmmind') {
					move.name = 'Surplus of Humour';
					move.self = {boosts: {spa: 1, atk: 1}};
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', target, "Geomancy", target);
					};
				}
				if (move.id === 'shadowsneak') {
					move.name = 'Patent Hilarity';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Shadow Sneak", target);
					};
				}
				if (move.id === 'shadowball') {
					move.name = 'Ion Ray of Fun';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Simple Beam", target);
					};
				}
				if (move.id === 'shadowclaw') {
					move.name = 'Sword of Fun';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Sacred Sword", target);
					};
				}
				if (move.id === 'flashcannon') {
					move.name = 'Fun Cannon';
					move.secondaries = [{chance: 60, boosts: {spd: -1}}];
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Hydro Pump", target);
					};
				}
				if (move.id === 'dragontail') {
					move.name = '/kick';
					move.type = 'Steel';
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Karate Chop", target);
					};
				}
				if (move.id === 'hyperbeam') {
					move.name = '/ban';
					move.basePower = 150;
					move.type = 'Ghost';
				}
				if (move.id === 'memento') {
					move.name = 'HP Display Policy';
					move.boosts = {atk: -12, def: -12, spa: -12, spd: -12, spe: -12, accuracy: -12, evasion: -12};
					move.onTryHit = function (target, source) {
						this.attrLastMove('[still]');
						this.add('-anim', source, "Explosion", target);
					};
					move.onHit = function (target, source) {
						source.faint();
					};
				}
			}
			if (name === 'diatom') {
				if (move.id === 'healingwish') {
					move.name = 'Be Thankful';
					move.sideCondition = 'luckychant';
					move.onHit = function () {
						pokemon.side.addSideCondition('reflect');
						pokemon.side.addSideCondition('lightscreen');
						pokemon.side.addSideCondition('safeguard');
						pokemon.side.addSideCondition('mist');
						for (let i = 0; i < 6; i++) {
							let thanker = pokemon.side.pokemon[i];
							if (toId(thanker.name) !== name && !thanker.fainted) this.add('c|' + thanker.name + '|Thanks Diatom!');
							pokemon.hasBeenThanked = true;
						}
					};
				}
				if (move.id === 'psywave') {
					move.accuracy = 80;
					move.onMoveFail = function () {
						this.add('c|+Diatom|you should be thankful my psywave doesn\'t always hit');
					};
				}
			}
			if (move.id === 'growl' && name === 'limi') {
				move.name = 'Resilience';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Shadow Ball", target);
				};
				move.onHit = function (target, source) {
					target.trySetStatus('psn');
					source.trySetStatus('psn');
					source.addVolatile('resilience');
					source.addVolatile('aquaring');
				};
			}
			if (move.id === 'toxic' && name === 'mattl') {
				move.name = 'Topology';
				move.self = {status: 'tox'};
			}
			if (move.id === 'swagger' && name === 'mikel') {
				move.accuracy = true;
				move.name = 'Trolling Lobby';
				move.onTryHit = function (pokemon, source) {
					if (source.hp <= Math.floor(source.maxhp * 2 / 3)) return false;
					return;
				};
				move.onHit = function (pokemon, source) {
					pokemon.addVolatile('taunt');
					if (!pokemon.hasType('Grass')) pokemon.addVolatile('leechseed');
					pokemon.addVolatile('torment');
					this.directDamage(source.maxhp * 2 / 3, source, source);
				};
			}
			if (move.id === 'judgment' && name === 'greatsage') {
				move.type = 'Rock';
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Energy Ball", target);
					this.add('c|+Great Sage|JUDGEMENT ' + target.name);
				};
				move.onHit = function (target, source) {
					source.addVolatile('ingrain');
					source.addVolatile('aquaring');
				};
			}
			if (move.id === 'recover' && name === 'redew') {
				move.onHit = function (pokemon) {
					if (pokemon.trySetStatus('tox')) {
						this.add('-message', '+Redew lost at SPL and got badly poisoned due to excessive trolling!');
					}
				};
			}
			if (move.id === 'detect' && name === 'shaymin') {
				move.name = 'Flower Garden';
				move.type = 'Grass';
				move.self = {boosts: {def: 1, spa: 1, spd: 1}};
				move.onTryHit = function (target, source) {
					if (source.volatiles['flowergarden']) return false;
					this.attrLastMove('[still]');
					this.add('-anim', source, "Amnesia", source);
				};
				move.onHit = function (target, source) {
					source.addVolatile('stall');
					source.addVolatile('flowergarden');
				};
			}
			if (move.id === 'energyball' && name === 'somalia') {
				move.name = 'Ban Everyone';
				move.basePower = 0;
				delete move.secondary;
				move.category = 'Status';
				move.accuracy = 50 + 50 * pokemon.hp / pokemon.maxhp;
				move.onTryHit = function (target, source) {
					this.attrLastMove('[still]');
					this.add('-anim', source, "Explosion", target);
					source.faint();
				};
				move.onHit = function (target, source) {
					this.add('-anim', target, "Explosion", source);
					target.faint();
					target.side.addSideCondition('stealthrock');
					target.side.addSideCondition('toxicspikes');
				};
				move.onMoveFail = function (target, source, move) {
					source.faint();
				};
			}
			if (move.id === 'taunt' && name === 'talktakestime') {
				move.name = 'Bot Mute';
				move.onHit = function (target) {
					target.addVolatile('embargo');
					target.addVolatile('torment');
					target.addVolatile('healblock');
				};
			}
		},
	},

	// You are (not) prepared, May - June 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/0bffa43f85b8818e2c1f4c40e6b351a389f8c4c0

	{
		name: "[Seasonal] You are (not) prepared",

		team: 'randomSeasonalMay2015',
		mod: 'you-are-not-prepared',
		gameType: 'triples',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin() {
			this.add('raw|<b><font color="red">IMPORTANT!</font></b> All moves on this seasonal are custom. Use the command <b>/seasonaldata</b>, <b>/sdata</b>, or <b>/sdt</b> to know what they do.');
			this.add('raw|More information can be found <a href="http://www.smogon.com/forums/threads/3491902/page-12#post-6202283">here</a>');
		},
		onModifyMove(move) {
			// Shows legit name after use...
			let legitNames = {
				recover: "Cura", softboiled: "Curaga", reflect: "Wild Growth", acupressure: "Power Shield",
				holdhands: "Rejuvenation", luckychant: "Fairy Ward", followme: "Taunt", meditate: "Sacrifice",
				helpinghand: "Cooperation", spite: "Slow Down", aromaticmist: "Healing Touch", healbell: "Penance",
				fakeout: "Stop", endure: "Last Stand", withdraw: "Barkskin", seismictoss: "Punishment",
				flamethrower: "Flamestrike", fireblast: "Conflagration", thunderbolt: "Moonfire", thunder: "Starfire",
				toxic: "Corruption", leechseed: "Soul Leech", icebeam: "Ice Lance", freezeshock: "Frostbite",
				aircutter: "Hurricane", muddywater: "Storm", furyswipes: "Fury", scratch: "Garrote", slash: "Mutilate",
				smog: "Poison Gas", protect: "Evasion", matblock: "Sacred Shield",
			};
			if (move.id in legitNames) {
				move.name = legitNames[move.id];
			}
		},
		onFaint(pokemon) {
			let message = {
				'Amy': 'French?', 'Princess Leia': 'Why, you stuck up, half-witted, scruffy-looking Nerf herder.',
				'Scruffy': "Scruffy's gonna die the way he lived. [Turns page of Zero-G Juggs magazine.] Mmhm.",
				'Yoda': 'Wrath leads to the dark side.', 'Bender': 'DEATH TO ALL HUMANS!', 'Gurren Lagann': 'Later, buddy.',
				'Lagann': "Eh, I guess I'm no one.", 'Rei Ayanami': 'Man fears the darkness, and so he scrapes away at the edges of it with fire.',
				'Slurms McKenzie': 'I will keep partying until the end.', 'C3PO': 'Oh, dear!',
				'Hermes': 'I can still... limbo...', 'Professor Farnsworth': 'Bad news, everyone!', 'Kif': 'Sigh.',
				'Jar Jar Binks': "Better dead here than deader in the Core. Ye gods, whatta meesa sayin'?",
				'R2D2': '*beep boop*', 'Asuka Langley': 'Disgusting.', 'Chewy': 'GRARARWOOWRALWRL',
				'Fry': 'Huh. Did everything just taste purple for a second?', 'Han Solo': 'I should have shot first...',
				'Leela': 'Yeeee-hAW!', 'Luke Skywalker': 'I could not use the force...',
				'Nibbler': 'I hereby place an order for one cheese pizza.',
				'Shinji Ikari': 'It would be better if I never existed. I should just die too.', 'Zoidberg': 'Why not Zoidberg?',
				'Anti-Spiral': 'If this is how it must be, protect the universe at all costs.', 'Gendo Ikari': 'Everything goes according to the plan.',
				'Kaworu Nagisa': 'Dying of your own will. That is the one and only absolute freedom there is.',
				'Jabba the Hut': 'Han, ma bukee.', 'Lilith': '...', 'Lrrr': "But I'm emperor of Omicron Persei 8!",
				'Mommy': 'Stupid!', 'Bobba Fett': "I see now I've done terrible things.", 'Zapp Brannigan': "Oh, God, I'm pathetic. Sorry. Just go...",
				'An angel': ',,,', 'Darth Vader': "I'm sorry, son.", 'Emperor Palpatine': 'What the hell is an "Aluminum Falcon"?',
				'Fender': '*beeps*', 'Storm Trooper': 'But my aim is perfect!',
			}[pokemon.name];
			this.add('-message', pokemon.name + ': ' + message);
		},
	},

	// Rainbow Road, August - September 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/cb7f7e5639b6e98986ea8b687a10e185639551f8
	{
		name: "[Seasonal] Rainbow Road",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
		mod: 'gen6',

		team: "randomRainbow",
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onBegin() {
			this.add('message', "The last attack on each Pok\u00e9mon is based on their Pok\u00e9dex color.");
			this.add('-message', "Red/Pink beats Yellow/Green, which beats Blue/Purple, which beats Red/Pink.");
			this.add('-message', "Using a color move on a Pok\u00e9mon in the same color group is a neutral hit.");
			this.add('-message', "Use /details [POKEMON] to check its Pok\u00e9dex color.");

			let physicalNames = {
				'Red': 'Crimson Crash', 'Pink': 'Rose Rush', 'Yellow': 'Saffron Strike', 'Green': 'Viridian Slash',
				'Blue': 'Blue Bombardment', 'Purple': 'Indigo Impact',
			};
			let specialNames = {
				'Red': 'Scarlet Shine', 'Pink': 'Coral Catapult', 'Yellow': 'Golden Gleam', 'Green': 'Emerald Flash',
				'Blue': 'Cerulean Surge', 'Purple': 'Violet Radiance',
			};
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				let color = pokemon.template.color;
				let category = (pokemon.stats.atk > pokemon.stats.spa ? 'Physical' : 'Special');
				let last = pokemon.moves.length - 1;
				let move = (category === 'Physical' ? physicalNames[color] : specialNames[color]);
				if (pokemon.moves[last]) {
					pokemon.moveSlots[last].move = move;
					pokemon.baseMoveSlots[last].move = move;
				}
			}
		},
		onBeforeTurn(pokemon) {
			let side = pokemon.side;
			side.item = '';

			let decisions = [];
			let decision, i;
			if (side.hadItem || this.randomChance(1, 4)) { // Can never get 2 consecutive turns of items
				side.hadItem = false;
				return;
			}
			switch (this.random(8)) {
			case 0:
				side.item = 'lightning';
				side.hadItem = true;
				this.add('message', "Lightning suddenly struck " + side.name + " and shrank their Pok\u00e9mon!");
				this.add('-start', pokemon, 'shrunken', '[silent]');
				break;
			case 1:
				side.item = 'blooper';
				side.hadItem = true;
				this.add('message', "A Blooper came down and splattered ink all over " + side.name + "'s screen!");
				this.add('-start', pokemon, 'blinded', '[silent]');
				break;
			case 2:
				if (pokemon.isGrounded()) {
					side.item = 'banana';
					side.hadItem = true;
					this.add('message', side.name + " slipped on a banana peel!");
					this.add('-start', pokemon, 'slipped', '[silent]');
					pokemon.addVolatile('flinch');
				}
				break;
			case 3:
				if (!side.sideConditions['goldenmushroom']) {
					side.item = 'goldmushroom';
					side.hadItem = true;
					this.add('message', side.name + " collected a Golden Mushroom, giving them a speed boost!");
					this.add('-start', pokemon, 'goldenmushroom', '[silent]');
					side.addSideCondition('goldenmushroom');
					side.sideConditions['goldenmushroom'].duration = 3;
					// Get all relevant decisions from the Pokemon and tweak speed.
					for (i = 0; i < this.queue.length; i++) {
						if (this.queue[i].pokemon === pokemon) {
							decision = this.queue[i];
							decision.speed = pokemon.getStat('spe');
							decisions.push(decision);
							// Cancel the decision
							this.queue.splice(i, 1);
							i--;
						}
					}
					for (i = 0; i < decisions.length; i++) {
						this.insertQueue(decisions[i]);
					}
				}
				break;
			case 4:
			case 5:
				if (!side.sideConditions['goldenmushroom']) {
					side.item = 'mushroom';
					side.hadItem = true;
					this.add('message', side.name + " collected a Mushroom, giving them a quick speed boost!");
					this.add('-start', pokemon, 'mushroom', '[silent]');
					side.addSideCondition('mushroom');
					side.sideConditions['mushroom'].duration = 1;
					// Get all relevant decisions from the Pokemon and tweak speed.
					for (i = 0; i < this.queue.length; i++) {
						if (this.queue[i].pokemon === pokemon) {
							decision = this.queue[i];
							decision.speed = pokemon.getStat('spe');
							decisions.push(decision);
							// Cancel the decision
							this.queue.splice(i, 1);
							i--;
						}
					}
					for (i = 0; i < decisions.length; i++) {
						this.insertQueue(decisions[i]);
					}
				}
				break;
			default:
				if (side.pokemonLeft - side.foe.pokemonLeft >= 2) {
					side.item = 'blueshell';
					side.hadItem = true;
					this.add('message', "A Blue Spiny Shell flew over the horizon and crashed into " + side.name + "!");
					this.damage(pokemon.maxhp / 2, pokemon, pokemon, this.getMove('judgment'), true);
				}
			}
		},
		onAccuracy(accuracy, target, source, move) {
			if (source.hasAbility('keeneye')) return;
			let modifier = 1;
			if (source.side.item === 'blooper' && !source.hasAbility('clearbody')) {
				modifier *= 0.4;
			}
			if (target.side.item === 'lightning') {
				modifier *= 0.8;
			}
			return this.chainModify(modifier);
		},
		onDisableMove(pokemon) {
			// Enforce Choice Item locking on color moves
			// Technically this glitches with Klutz, but Lopunny is Brown and will never appear :D
			if (!pokemon.ignoringItem() && pokemon.getItem().isChoice && pokemon.lastMove === 'swift') {
				let moves = pokemon.moveSlots;
				for (let i = 0; i < moves.length; i++) {
					if (moves[i].id !== 'swift') {
						pokemon.disableMove(moves[i].id, false);
					}
				}
			}
		},
		onEffectivenessPriority: -5,
		onEffectiveness(typeMod, target, type, move) {
			if (move.id !== 'swift') return;
			// Only calculate color effectiveness once
			if (target.getTypes()[0] !== type) return 0;
			let targetColor = target.template.color;
			let sourceColor = this.activePokemon.template.color;
			let effectiveness = {
				'Red': {'Red': 0, 'Pink': 0, 'Yellow': 1, 'Green': 1, 'Blue': -1, 'Purple': -1},
				'Pink': {'Red': 0, 'Pink': 0, 'Yellow': 1, 'Green': 1, 'Blue': -1, 'Purple': -1},
				'Yellow': {'Red': -1, 'Pink': -1, 'Yellow': 0, 'Green': 0, 'Blue': 1, 'Purple': 1},
				'Green': {'Red': -1, 'Pink': -1, 'Yellow': 0, 'Green': 0, 'Blue': 1, 'Purple': 1},
				'Blue': {'Red': 1, 'Pink': 1, 'Yellow': -1, 'Green': -1, 'Blue': 0, 'Purple': 0},
				'Purple': {'Red': 1, 'Pink': 1, 'Yellow': -1, 'Green': -1, 'Blue': 0, 'Purple': 0},
			};
			return effectiveness[sourceColor][targetColor];
		},
		onModifyDamage(damage, source, target, effect) {
			if (source === target || effect.effectType !== 'Move') return;
			if (target.side.item === 'lightning') return this.chainModify(2);
			if (source.side.item === 'lightning') return this.chainModify(0.5);
		},
		onModifySpe(speMod, pokemon) {
			if (pokemon.side.sideConditions['goldenmushroom'] || pokemon.side.sideConditions['mushroom']) {
				return this.chainModify(1.75);
			}
		},
		onResidual(battle) {
			let side;
			for (let i = 0; i < battle.sides.length; i++) {
				side = battle.sides[i];
				if (side.sideConditions['goldenmushroom'] && side.sideConditions['goldenmushroom'].duration === 1) {
					this.add('-message', "The effect of " + side.name + "'s Golden Mushroom wore off.");
					this.add('-end', side.active[0], 'goldenmushroom', '[silent]');
					side.removeSideCondition('goldenmushroom');
				}
				switch (side.item) {
				case 'lightning':
					this.add('-end', side.active[0], 'shrunken', '[silent]');
					break;
				case 'blooper':
					this.add('-end', side.active[0], 'blinded', '[silent]');
					break;
				case 'banana':
					this.add('-end', side.active[0], 'slipped', '[silent]');
					break;
				case 'mushroom':
					this.add('-end', side.active[0], 'mushroom', '[silent]');
				}

				side.item = '';
			}
		},
		onModifyMove(move, pokemon) {
			if (move.id !== 'swift') return;
			let physicalnames = {
				'Red': 'Crimson Crash', 'Pink': 'Rose Rush', 'Yellow': 'Saffron Strike', 'Green': 'Viridian Slash',
				'Blue': 'Blue Bombardment', 'Purple': 'Indigo Impact',
			};
			let specialnames = {
				'Red': 'Scarlet Shine', 'Pink': 'Coral Catapult', 'Yellow': 'Golden Gleam', 'Green': 'Emerald Flash',
				'Blue': 'Cerulean Surge', 'Purple': 'Violet Radiance',
			};
			let color = pokemon.template.color;
			move.category = (pokemon.stats.atk > pokemon.stats.spa ? 'Physical' : 'Special');
			move.name = (move.category === 'Physical' ? physicalnames[color] : specialnames[color]);
			move.basePower = 100;
			move.accuracy = 100;
			move.type = '???';
			if (move.category === 'Physical') move.flags['contact'] = true;
		},
		onPrepareHit(pokemon, target, move) {
			if (move.id !== 'swift') return;
			let animations = {
				'Crimson Crash': 'Flare Blitz', 'Scarlet Shine': 'Fusion Flare', 'Rose Rush': 'Play Rough',
				'Coral Catapult': 'Moonblast', 'Saffron Strike': 'Bolt Strike',	'Golden Gleam': 'Charge Beam',
				'Viridian Slash': 'Power Whip', 'Emerald Flash': 'Solarbeam', 'Blue Bombardment': 'Waterfall',
				'Cerulean Surge': 'Hydro Pump', 'Indigo Impact': 'Poison Jab', 'Violet Radiance': 'Gunk Shot',
			};
			this.attrLastMove('[anim] ' + animations[move.name]);
		},
		onSwitchInPriority: -9,
		onSwitchIn(pokemon) {
			if (!pokemon.hp) return;
			this.add('-start', pokemon, pokemon.template.color, '[silent]');
			if (pokemon.side.item === 'lightning') {
				this.add('-start', pokemon, 'shrunken', '[silent]');
			}
			if (pokemon.side.sideConditions['goldenmushroom']) {
				this.add('-start', pokemon, 'goldenmushroom', '[silent]');
			}
		},
		onSwitchOut(pokemon) {
			this.add('-end', pokemon, pokemon.template.color, '[silent]');
		},
	},

	// Spoopy Party, October 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/fc0237649cff994585a298b47199ba70925c0bb5/

	{
		name: "[Seasonal] Spoopy Party",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
		mod: 'gen6',

		team: 'randomSpoopy',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onSwitchIn(pokemon) {
			if (pokemon.species === 'Magikarp') {
				this.boost({spe: 4, spd: 2, def: 2}, pokemon, pokemon, 'the power of dank');
			}
		},
		onModifyMove(move) {
			if (move.id === 'aquaring') {
				move.volatileStatus = 'wonderring';
				move.onHit = function (pokemon) {
					this.add('-start', pokemon, 'Aqua Ring');
					this.add('-message', "7.8/10, too much water - IGN");
				};
			}
			if (move.id === 'hyperbeam') {
				move.type = 'Water';
				move.accuracy = true;
				delete move.self;
				move.onTryHit = function (target, source) {
					this.add('-message', target.name + "'s fuel cannot melt " + source.name + " beams!");
				};
			}
			if (move.id === 'trickortreat') {
				switch (this.random(7)) {
				case 0:
					move.category = 'Special';
					move.type = 'Fire';
					move.basePower = 200;
					move.onTryHit = function () {
						this.add('-message', "Pumpkin bomb!");
					};
					move.onHit = function () {};
					break;
				case 1:
					move.category = 'Physical';
					move.type = 'Poison';
					move.basePower = 25;
					move.multihit = 4;
					move.onTryHit = function () {
						this.add('-message', "Toilet paper missile attack!");
					};
					move.onHit = function () {};
					break;
				case 2:
					move.onTryHit = function () {
						this.add('-message', "Yum! Chocolate!");
					};
					move.onHit = function (target, source) {
						this.heal(Math.ceil(target.maxhp * 0.5));
					};
					break;
				case 3:
					move.onTryHit = function () {
						this.add('-message', "This is a rather bland candy.");
					};
					move.onHit = function (target, source) {
						this.heal(Math.ceil(target.maxhp * 0.25));
						target.setStatus('par');
						target.addVolatile('confusion');
					};
					break;
				case 4:
					move.onTryHit = function () {
						this.add('-message', "You are about to be rotten-egged on!");
					};
					move.onHit = function (target, source) {
						target.setStatus('tox');
						target.addVolatile('torment');
					};
					break;
				case 5:
					move.category = 'Special';
					move.type = 'Dark';
					move.basePower = 500;
					move.self = {volatileStatus: 'mustrecharge'};
					move.onTryHit = function () {
						this.add('-message', "Ultimate Super Hiper Mega Awesome Beam destroyer of worlds!");
					};
					move.onHit = function (target, source) {
						this.add('-message', source.name + " was caught in the explosion!");
						source.setStatus('brn');
						source.addVolatile('disabled');
						source.addVolatile('confusion');
					};
					break;
				case 6:
					move.onTryHit = function () {
						this.add('-message', "Have some refreshment, my fellow.");
					};
					move.onHit = function (target, source) {
						target.addVolatile('aquaring');
					};
					break;
				}
			}
		},
		onResidual() {
			let allpokes = this.p1.active.concat(this.p2.active);
			let pokemon;
			for (let i = 0; i < allpokes.length; i++) {
				pokemon = allpokes[i];
				if (pokemon.hp && pokemon.volatiles['wonderring']) {
					this.heal(pokemon.maxhp / 8, pokemon, pokemon, 'dank memes');
				}
			}
		},
	},

	// Super Squad Smackdown, November 2015
	// https://github.com/Zarel/Pokemon-Showdown/tree/06b23a562e4b6d7814c97519b5f7584a8acfb493

	{
		name: "[Seasonal] Super Squad Smackdown",
		desc: ["&bullet; <a href=\"https://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
		mod: 'gen6',

		team: 'randomSeasonalHero',
		ruleset: ['HP Percentage Mod', 'Sleep Clause Mod', 'Cancel Mod'],
		onEffectiveness(typeMod, target, move, type) {
			if (this.activePokemon && this.activePokemon.name === 'Magneto' && move.id === 'flashcannon' && type === 'Steel') return 1;
		},
		onSwitchInPriority: 10,
		onSwitchIn(pokemon) {
			switch (pokemon.name) {
			case 'Iron Man':
				if (pokemon.addType('Steel')) {
					this.add('-start', pokemon, 'typeadd', 'Steel', '[silent]');
				}
				break;
			case 'Spiderman':
				this.boost({atk: 1, spe: 2}, pokemon, pokemon, 'Spidey Sense');
				break;
			}
		},
	},
];