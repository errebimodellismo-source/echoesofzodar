// Generated story translations. Italian remains the source of truth in storiesData.js.

export const STORY_TRANSLATIONS = {
  "en": {
    "storia_risveglio_nebbia": {
      "title": "The Awakening in the Fog",
      "description": "You wake up in a forest shrouded in fog, with no memory of how you got here. Something dark moves among the trees.",
      "difficulty": "normal",
      "chapters": {
        "cap1": {
          "title": "The Awakening"
        },
        "cap2": {
          "title": "The Hidden Village"
        }
      },
      "scenes": {
        "cap1_intro": {
          "title": "Eyes in the Fog",
          "text": "The first thing you feel is the cold.\n\nA damp cold that seeps under your clothes, smelling of moss and wet earth. Then the fog — white, dense, still like a wall of wool — surrounds you from all sides.\n\nYou rise slowly. The forest around you is unnaturally silent. No birds. No wind. Only your breath and the crunch of leaves underfoot.\n\n*Where are we?* you think. And above all — *how did we get here?*",
          "choices": {}
        },
        "cap1_road": {
          "title": "The Fork in the Forest",
          "text": "Three paths open before you among the trees. One descends towards the valley, one climbs towards a hill where you glimpse something dark outlined in the fog, one leads straight into the dense woods.\n\nA distant sound — almost a moan — comes from the direction of the thick forest.",
          "choices": {
            "0": {
              "text": "📉 Follow the path descending to the valley"
            },
            "1": {
              "text": "🏔️ Climb towards the silhouette on the hill"
            },
            "2": {
              "text": "🌲 Venture into the forest towards the moan"
            },
            "3": {
              "text": "🔍 Stop and study the signs around"
            }
          }
        },
        "cap1_investigate": {
          "title": "Tracks in the Mud",
          "text": "You kneel and study the ground. Footprints, broken branches, signs of dragging...",
          "choices": {},
          "skillCheck": {
            "successText": "Your sharp mind reads the tracks like an open book.",
            "failureText": "The tracks are confused and illegible. The forest reveals no secrets to you."
          }
        },
        "cap1_investigate_success": {
          "title": "The Truth in the Footprints",
          "text": "The footprints tell a story: someone — or something — dragged you here while you were asleep. The tracks come from the north, from the direction of the hill. They are human footprints, but too large, with a strange mechanical regularity.\n\nYou know where to go.",
          "choices": {}
        },
        "cap1_investigate_fail": {
          "title": "Fog in the Mind",
          "text": "You can't make sense of anything. The ground is a chaos of mud and leaves. Perhaps the fog clouds your thoughts as well.\n\nYou must choose blindly.",
          "choices": {}
        },
        "cap1_valley": {
          "title": "The Descent",
          "text": "The path descends steeply among roots and wet rocks. The fog thins as you go down, and after a few minutes you glimpse a flickering light below.\n\nA campfire. Someone is camped in the valley.",
          "choices": {}
        },
        "cap1_forest_sound": {
          "title": "The Moan in the Forest",
          "text": "You venture among the trees following the sound. The fog here is denser, almost solid. The branches close above you like intertwined hands.\n\nThe moan grows louder... then suddenly stops.\n\nAnd before you appear three pairs of yellow eyes shining in the darkness.",
          "choices": {}
        },
        "cap1_wolf_ambush": {
          "title": "Wolves of the Fog",
          "text": "The wolves leap at you emitting muffled growls. They are not normal — their eyes glow with an unnatural light and their fur is partially translucent as if made of the fog itself.",
          "choices": {},
          "combat": {
            "monsters": {
              "0": {
                "name": "Fog Wolf"
              },
              "1": {
                "name": "Fog Wolf"
              },
              "2": {
                "name": "Fog Wolf"
              }
            }
          }
        },
        "cap1_wolf_victory": {
          "title": "The Fog Withdraws",
          "text": "The wolves fall and dissolve into the fog from which they came. Where they lay remain only tufts of fur and a faint silvery glow.\n\nAmong the roots of a tree you find what the wolves were guarding: a small abandoned backpack.",
          "choices": {}
        },
        "cap1_wolf_defeat": {
          "title": "Devoured by the Fog",
          "text": "The wolves overwhelm you. The last thought before darkness is the fog — white, cold, endless.\n\nWhen you open your eyes again you are back at the beginning, as if nothing had happened. Or maybe it has always been so.",
          "choices": {},
          "gameOver": {
            "text": "The fog wolves have overcome you. Do you want to try again from the start?"
          }
        },
        "cap1_hill_approach": {
          "title": "The Silhouette on the Hill",
          "text": "You climb towards the hill. The fog here is thinner, almost transparent, and the silhouette reveals itself to be an ancient stone tower, partially collapsed.\n\nThe stones are covered with moss and strange engraved symbols. The door is ajar.",
          "choices": {}
        },
        "cap1_tower_choice": {
          "title": "The Abandoned Tower",
          "text": "The tower emanates a sense of centuries-old abandonment, but also something else — a presence, an artificial warmth that does not belong to this forest.",
          "choices": {
            "0": {
              "text": "🚪 Enter the tower"
            },
            "1": {
              "text": "🔮 Examine the symbols on the stones"
            },
            "2": {
              "text": "🔙 Return to the fork"
            }
          }
        },
        "cap1_tower_symbols": {
          "title": "Ancient Symbols",
          "text": "You approach the stones and study the symbols. They are an ancient language, perhaps predating the kingdom...",
          "choices": {},
          "skillCheck": {
            "successText": "You recognize the ancient Zodarian script. Knowing this will be useful.",
            "failureText": "The symbols are incomprehensible. You enter the tower."
          }
        },
        "cap1_tower_symbols_read": {
          "title": "The Builders' Message",
          "text": "The symbols say: *\"Those who sleep in the forest do not sleep by choice. The fog is hungry. The anchor is within.\"*\n\nYou don't know what \"the anchor\" means, but you will keep it in mind.",
          "choices": {}
        },
        "cap1_tower_inside": {
          "title": "Inside the Tower",
          "text": "The inside of the tower is surprisingly intact. A table, a chair, remains of a recent fire. And on a stone pedestal — a lantern emitting a blue-silver light.\n\nAs soon as you touch it, the fog outside the window slightly withdraws, as if afraid of the light.",
          "choices": {}
        },
        "cap1_lantern_choice": {
          "title": "The Lantern of the Fog",
          "text": "The lantern pulses in your hand with a warm and reassuring light. It seems made to fight this fog.",
          "choices": {
            "0": {
              "text": "🏮 Take the lantern and descend towards the valley"
            },
            "1": {
              "text": "📚 Search for more clues in the tower before leaving"
            }
          }
        },
        "cap1_tower_search": {
          "title": "Hidden Treasures",
          "text": "Rummaging among the floorboards you find a trapdoor. Below: a small box with some coins and a crumpled note.\n\nThe note says: *\"If you are reading this, the plan worked. Find Mira in the village. Destroy the anchor.\"*",
          "choices": {}
        },
        "cap1_wanderer": {
          "title": "The Man by the Fire",
          "text": "Around the campfire you find an old man wrapped in a gray cloak. He looks at you arriving without surprise, as if he expected you.\n\n\"Finally,\" he says. \"I made fire for you. Sit down.\"\n\nHis name is Aldric. He was the tower’s guardian, he says, before *she* arrived.\n\n\"The fog is not fog,\" he explains. \"It is an entity. It feeds on memories, names, identities. It stole your memories to keep you here. But there is a way to stop it.\"",
          "choices": {}
        },
        "cap1_aldric_quest": {
          "title": "Aldric's Mission",
          "text": "\"In the center of the forest there is an anchor — a crystal the fog uses as its heart. Destroy it and the fog will dissolve. But the forest will defend it with all it has.\"\n\nHe looks at you with tired but bright eyes.\n\n\"Do you have what it takes?\" he asks.",
          "choices": {
            "0": {
              "text": "⚔️ We are ready. Take us to the anchor."
            },
            "1": {
              "text": "🏮 We found your lantern! (requires hasLantern)"
            },
            "2": {
              "text": "📜 We found your note! (requires foundNote)"
            },
            "3": {
              "text": "❓ Tell us more before deciding."
            }
          }
        },
        "cap1_aldric_lore": {
          "title": "Aldric's Story",
          "text": "Aldric tells you how the fog arrived three years ago — suddenly, in a single night. The village of Brumeval disappeared into the fog. He managed to escape with the lantern.\n\n\"The lantern is made with anti-fog crystals. The anchor is the opposite — a pro-fog crystal. Break it.\"",
          "choices": {}
        },
        "cap1_aldric_lantern": {
          "title": "The Lantern Recovered",
          "text": "Aldric's eyes light up when you show the lantern.\n\n\"I left it in the tower hoping someone would find it. With it, you will have an advantage against the anchor's guardians. The fog will fear you.\"\n\nHe explains that with the lantern, fog monsters will take extra damage.",
          "choices": {}
        },
        "cap1_aldric_note": {
          "title": "Aldric's Note",
          "text": "\"I wrote that note,\" Aldric says with a sad smile. \"Mira is my daughter. She stayed in the village when the fog came. If she is still alive...\"\n\nHe stops. \"After the anchor, find Brumeval. Find Mira.\"\n\nThe mission now has an added meaning.",
          "choices": {}
        },
        "cap1_ending_brave": {
          "title": "Towards the Heart of the Fog",
          "text": "Aldric points you in the direction. You walk through the forest with the fog retreating before you at every step, almost fearful.\n\nSoon you will find the anchor. And after — perhaps — your memories.\n\n*End of Chapter 1 — The Awakening*",
          "choices": {}
        },
        "cap1_ending_prepared": {
          "title": "Armed with Light and Knowledge",
          "text": "You set out with something more than the others: Aldric's lantern, his words, perhaps a name — Mira — that will give you strength when the forest grows darker.\n\nThe fog withdraws before your light. You are ready.\n\n*End of Chapter 1 — The Awakening (Prepared Path)*",
          "choices": {}
        },
        "cap1_return_point": {
          "title": "The Forest Behind",
          "text": "With the wolves defeated, the forest seems to breathe differently. The fog has slightly withdrawn in this area, as if your victory weakened something.\n\nYou spot below the light of a campfire.",
          "choices": {}
        },
        "cap2_intro": {
          "title": "Brumeval",
          "text": "The village emerges from the fog like a forgotten dream.\n\nThe houses are still there — open doors, lit windows, fires burning — but silent. As if the inhabitants stepped out a moment ago and were about to return.\n\nBut they do not return. The village is frozen in time, in an eternal suspended moment.\n\nAldric, left behind, had said: *\"Look for Mira at the inn. If it is still her.\"*",
          "choices": {}
        },
        "cap2_village_explore": {
          "title": "In the Silent Village",
          "text": "The streets of Brumeval are deserted but not abandoned. You hear noises beyond the doors: muffled voices, footsteps, the clinking of cutlery. But when you knock — silence.\n\nWhere do you go first?",
          "choices": {
            "0": {
              "text": "🏨 To the inn (look for Mira)"
            },
            "1": {
              "text": "⛪ To the church (in the village center)"
            },
            "2": {
              "text": "🔮 To the well (it seems to glow with blue light)"
            }
          }
        },
        "cap2_inn": {
          "title": "The Gray Stag Inn",
          "text": "The inn is the only place in the village showing signs of real life: a woman standing behind the counter, empty eyes staring at you without seeing you.\n\nThen — a blink. And she recognizes you.\n\n\"Are you... real?\" she whispers. \"You are not fog?\"\n\nHer name is Mira. And she has waited three years.",
          "choices": {}
        },
        "cap2_mira_dialog": {
          "title": "Mira",
          "text": "Mira tells you urgently: all the villagers are trapped in a time loop imposed by the fog. They live the same day endlessly without knowing it. Only she is aware.\n\n\"The anchor is in the crypt beneath the church. It is guarded by a guardian. I know how to get there, but I cannot enter — the fog keeps me anchored to the village.\"\n\nShe begs you to do it.",
          "choices": {
            "0": {
              "text": "✅ We will go to the crypt."
            },
            "1": {
              "text": "📖 Your father Aldric sends his regards. (requires nameMira)"
            }
          }
        },
        "cap2_mira_father": {
          "title": "Aldric's Message",
          "text": "Mira holds her breath. Tears fall silently.\n\n\"He is alive,\" she whispers. \"He is still alive.\"\n\nShe straightens, determined. \"Then we must succeed. Destroy the anchor. Free the village. And bring me back to my father.\"\n\nShe gives you an ancient iron key. \"For the crypt.\"",
          "choices": {}
        },
        "cap2_church": {
          "title": "The Silent Church",
          "text": "The church is cold and silent. The pews are full of motionless figures — villagers frozen in prayer, eyes open and empty.\n\nOn the floor, in front of the altar, is a stone trapdoor. It is sealed with symbols identical to those on the tower.\n\n\"A key is needed,\" someone in the group says.",
          "choices": {}
        },
        "cap2_well": {
          "title": "The Glowing Well",
          "text": "The well emits a blue-silver light — identical to Aldric's lantern. You lean over to look: the water glows from within.",
          "choices": {},
          "skillCheck": {
            "successText": "You recognize anti-fog magic. This water is a weapon.",
            "failureText": "You don't understand the nature of the light, but something tells you it is precious."
          }
        },
        "cap2_well_success": {
          "title": "The Water of Memory",
          "text": "You collect the glowing water in a vial found near the well. You can use it in combat against the anchor's guardian — it will deal extra damage to fog beings.",
          "choices": {}
        },
        "cap2_well_fail": {
          "title": "Mysterious Water",
          "text": "The water is beautiful and luminous, but you don't know how to use it. You proceed towards the inn.",
          "choices": {}
        },
        "cap2_crypt_approach": {
          "title": "The Descent into the Crypt",
          "text": "The trapdoor beneath the altar gives way — with Mira's key or brute force. The stone stairs descend into darkness.\n\nThe air is icy, saturated with solid fog moving like steam. And at the bottom of the stairs, a pulsating blue light — the anchor.\n\nBut between you and the anchor, something moves.",
          "choices": {}
        },
        "cap2_guardian_combat": {
          "title": "The Anchor's Guardian",
          "text": "A humanoid form made entirely of condensed fog rises before you. Its eyes are empty black holes. It emits a silent scream that chills your blood.\n\n*The Anchor's Guardian confronts you.*",
          "choices": {},
          "combat": {
            "monsters": {
              "0": {
                "name": "Anchor's Guardian"
              }
            }
          }
        },
        "cap2_guardian_defeat": {
          "title": "Absorbed by the Fog",
          "text": "The Guardian overwhelms you. The fog swallows you and your faces join the silent figures in the church pews.\n\nYou have lost. But the fog never forgets. Perhaps one day you will break the cycle.",
          "choices": {},
          "gameOver": {
            "text": "The Anchor's Guardian has defeated you. Do you want to try again from the crypt entrance?"
          }
        },
        "cap2_anchor_destroy": {
          "title": "The Anchor Breaks",
          "text": "With the Guardian dissolved, you approach the crystal. It pulses with an intense blue light, almost painful to look at.\n\nYou strike it with all your strength.\n\nThe crystal cracks. It breaks. It explodes in a cascade of white light that rises up the stairs, breaks through the church doors, spreads throughout the village.\n\nThe fog screams — a sound you feel more in your bones than your ears — and then dissolves.\n\nThe sun emerges for the first time in three years.",
          "choices": {}
        },
        "cap2_ending": {
          "title": "The Sun over Brumeval",
          "text": "The villagers awaken as from a long dream. Confused, disoriented, but alive. Real.\n\nMira runs out of the inn, shielding her eyes from the sun she hasn't seen in three years.\n\nAnd on the horizon, through the forest freed from the fog, you see the figure of an old man in a gray cloak walking towards the village.\n\nAldric and Mira will be reunited.\n\nYou, nameless and memoryless heroes, have saved Brumeval. Your memories may never return — but you have created new ones.\n\n*The End — The Awakening in the Fog*",
          "choices": {}
        }
      }
    }
  }
};
