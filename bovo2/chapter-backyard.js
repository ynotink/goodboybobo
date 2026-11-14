'use strict';
window.BOBO_CHAPTER={
 "id": "backyard-paintkit-A-preview",
 "title": "THE BACKYARD",
 "subtitle": "Chapter 1",
 "font": "approved/a/home/Nunito-Black.ttf",
 "sky": "art/v5/sky.png",
 "farStrip": "art/sky/far_strip.png",
 "terrain": {
  "A": "art/bbA/terrain_A.webp",
  "B": "art/bbA/terrain_B.webp"
 },
 "connectors": {
  "X1": {
   "name": "Garden gate",
   "ground": "art/bbA/conn_XL.webp",
   "parts": []
  },
  "X2": {
   "name": "Gateway to the Neighborhood",
   "ground": "art/bbA/conn_XR.webp",
   "parts": []
  }
 },
 "sprites": {
  "tree": {
   "src": "art/backyard/tree.png",
   "w": 1240,
   "h": 1131.4868309260833,
   "native": [
    1177,
    1074
   ],
   "group": "structure"
  },
  "doghouse": {
   "src": "art/backyard/doghouse.png",
   "w": 880,
   "h": 828.8829311885612,
   "native": [
    1119,
    1054
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "shed": {
   "src": "art/backyard/shed.png",
   "w": 900,
   "h": 696.919770773639,
   "native": [
    1396,
    1081
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "fence_segment": {
   "src": "art/backyard/fence_segment.png",
   "w": 520,
   "h": 247.58873929008567,
   "native": [
    817,
    389
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012,
    "supportBase": 0.995,
    "supportRanges": [
     [
      0,
      0.12
     ],
     [
      0.88,
      1
     ]
    ]
   }
  },
  "gate_post": {
   "src": "art/backyard/gate_post.png",
   "w": 75.728,
   "h": 300,
   "native": [
    104,
    412
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "gate_leaf_left": {
   "src": "art/backyard/gate_leaf_left.png",
   "w": 119.206,
   "h": 260,
   "native": [
    381,
    831
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "gate_leaf_right": {
   "src": "art/backyard/gate_leaf_right.png",
   "w": 119.663,
   "h": 260,
   "native": [
    382,
    830
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "arbor": {
   "src": "art/backyard/arbor.png",
   "w": 510,
   "h": 519.8455598455598,
   "native": [
    518,
    528
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "bed_lettuce": {
   "src": "art/backyard/bed_lettuce.png",
   "w": 540,
   "h": 289.8205546492659,
   "native": [
    613,
    329
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.6,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "bed_tomato": {
   "src": "art/backyard/bed_tomato.png",
   "w": 540,
   "h": 450.7908611599297,
   "native": [
    569,
    475
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.6,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "bed_lavender": {
   "src": "art/backyard/bed_lavender.png",
   "w": 500,
   "h": 440.2730375426621,
   "native": [
    586,
    516
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.6,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "boxwood": {
   "src": "art/backyard/boxwood.png",
   "w": 277.358,
   "h": 210,
   "native": [
    630,
    477
   ],
   "group": "greenery"
  },
  "fern": {
   "src": "art/backyard/fern.png",
   "w": 280,
   "h": 198.516,
   "native": [
    701,
    497
   ],
   "group": "greenery"
  },
  "hosta": {
   "src": "art/backyard/hosta.png",
   "w": 280,
   "h": 188.896,
   "native": [
    670,
    452
   ],
   "group": "greenery"
  },
  "daisies": {
   "src": "art/backyard/daisies.png",
   "w": 280,
   "h": 193.947,
   "native": [
    641,
    444
   ],
   "group": "white_yellow"
  },
  "lavender": {
   "src": "art/backyard/lavender.png",
   "w": 280,
   "h": 197.826,
   "native": [
    644,
    455
   ],
   "group": "blue_purple"
  },
  "blue_hydrangea": {
   "src": "art/backyard/blue_hydrangea.png",
   "w": 257.28,
   "h": 210,
   "native": [
    653,
    533
   ],
   "group": "blue_purple"
  },
  "marigolds": {
   "src": "art/backyard/marigolds.png",
   "w": 269.231,
   "h": 210,
   "native": [
    650,
    507
   ],
   "group": "orange_red"
  },
  "red_tulips": {
   "src": "art/backyard/red_tulips.png",
   "w": 270.833,
   "h": 210,
   "native": [
    650,
    504
   ],
   "group": "orange_red"
  },
  "pink_hydrangea": {
   "src": "art/backyard/pink_hydrangea.png",
   "w": 278.914,
   "h": 210,
   "native": [
    599,
    451
   ],
   "group": "pink"
  },
  "pot": {
   "src": "art/backyard/pot.png",
   "w": 159.766,
   "h": 150,
   "native": [
    409,
    384
   ],
   "group": "detail"
  },
  "watering_can": {
   "src": "art/backyard/watering_can.png",
   "w": 170,
   "h": 103.006,
   "native": [
    642,
    389
   ],
   "group": "detail"
  },
  "hose": {
   "src": "art/backyard/hose.png",
   "w": 170,
   "h": 112.128,
   "native": [
    564,
    372
   ],
   "group": "detail"
  },
  "bone_toy": {
   "src": "art/backyard/bone_toy.png",
   "w": 170,
   "h": 87.723,
   "native": [
    593,
    306
   ],
   "group": "detail"
  },
  "mushrooms": {
   "src": "art/backyard/mushrooms.png",
   "w": 170,
   "h": 143.586,
   "native": [
    502,
    424
   ],
   "group": "detail"
  },
  "leaf_pile": {
   "src": "art/backyard/leaf_pile.png",
   "w": 170,
   "h": 104.436,
   "native": [
    656,
    403
   ],
   "group": "detail"
  },
  "stepping_stones": {
   "src": "art/backyard/stepping_stones.png",
   "w": 170,
   "h": 104.399,
   "native": [
    666,
    409
   ],
   "group": "detail"
  },
  "perch_rock": {
   "src": "art/props/rock.png",
   "w": 230,
   "h": 141.53846153846155,
   "native": [
    520,
    320
   ],
   "group": "detail"
  },
  "bb_tree_a": {
   "src": "art/bbA/tree_a.webp",
   "w": 689.1860007864726,
   "h": 1150,
   "native": [
    1524,
    2543
   ],
   "group": "structure"
  },
  "bb_tree_b": {
   "src": "art/bbA/tree_b.webp",
   "w": 659.386209645277,
   "h": 1100,
   "native": [
    1504,
    2509
   ],
   "group": "structure"
  },
  "bb_dog": {
   "src": "art/bbA/doghouse_bowl.webp",
   "w": 915.0089126559714,
   "h": 820,
   "native": [
    1252,
    1122
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "bb_rock": {
   "src": "art/bbA/rock.webp",
   "w": 331.57894736842104,
   "h": 170,
   "native": [
    1260,
    646
   ],
   "group": "detail"
  },
  "bb_flrock": {
   "src": "art/bbA/flowers_rock.webp",
   "w": 342.69896193771626,
   "h": 240,
   "native": [
    1238,
    867
   ],
   "group": "detail"
  },
  "bb_bush": {
   "src": "art/bbA/bush_daisies.webp",
   "w": 375.3,
   "h": 270,
   "native": [
    1251,
    900
   ],
   "group": "greenery"
  },
  "bb_fern": {
   "src": "art/bbA/fern.webp",
   "w": 285.6043956043956,
   "h": 230,
   "native": [
    1243,
    1001
   ],
   "group": "greenery"
  },
  "p2_birdbath": {
   "src": "art/bbA/p2_birdbath.webp",
   "w": 327.9012345679012,
   "h": 400,
   "native": [
    996,
    1215
   ],
   "group": "greenery"
  },
  "p2_bush_flowers": {
   "src": "art/bbA/p2_bush_flowers.webp",
   "w": 308.57142857142856,
   "h": 240,
   "native": [
    1260,
    980
   ],
   "group": "greenery"
  },
  "p2_fence_segment": {
   "src": "art/bbA/p2_fence_segment.webp",
   "w": 799.1483516483516,
   "h": 380,
   "native": [
    1531,
    728
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012,
    "supportBase": 0.995,
    "supportRanges": [
     [
      0,
      0.12
     ],
     [
      0.88,
      1
     ]
    ]
   }
  },
  "p2_gate_leaf_left": {
   "src": "art/bbA/p2_gate_leaf_left.webp",
   "w": 257.57335448057097,
   "h": 400,
   "native": [
    812,
    1261
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "p2_gate_leaf_right": {
   "src": "art/bbA/p2_gate_leaf_right.webp",
   "w": 224.15153906866612,
   "h": 400,
   "native": [
    710,
    1267
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "p2_gate_post_left": {
   "src": "art/bbA/p2_gate_post_left.webp",
   "w": 146.1345852895149,
   "h": 460,
   "native": [
    406,
    1278
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "p2_gate_post_right": {
   "src": "art/bbA/p2_gate_post_right.webp",
   "w": 146.1345852895149,
   "h": 460,
   "native": [
    406,
    1278
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "p2_hedge": {
   "src": "art/bbA/p2_hedge.webp",
   "w": 548.40625,
   "h": 230,
   "native": [
    1526,
    640
   ],
   "group": "greenery"
  },
  "p2_lamp_post": {
   "src": "art/bbA/p2_lamp_post.webp",
   "w": 241.7277486910995,
   "h": 760,
   "native": [
    486,
    1528
   ],
   "group": "greenery"
  },
  "p2_lavender_row": {
   "src": "art/bbA/p2_lavender_row.webp",
   "w": 315.6262425447316,
   "h": 210,
   "native": [
    1512,
    1006
   ],
   "group": "greenery"
  },
  "p2_mailbox": {
   "src": "art/bbA/p2_mailbox.webp",
   "w": 273.016894609815,
   "h": 420,
   "native": [
    808,
    1243
   ],
   "group": "greenery"
  },
  "p2_rose_bush": {
   "src": "art/bbA/p2_rose_bush.webp",
   "w": 303.76119402985074,
   "h": 240,
   "native": [
    1272,
    1005
   ],
   "group": "greenery"
  },
  "p2_shed": {
   "src": "art/bbA/p2_shed.webp",
   "w": 1050.0,
   "h": 1050,
   "native": [
    1522,
    1522
   ],
   "group": "structure",
   "grounding": {
    "bandTop": 0.72,
    "minContact": 0.74,
    "referenceSlope": 0.6,
    "contactOpacity": 0.38,
    "contactWidth": 0.012
   }
  },
  "p2_tire_swing_tree": {
   "src": "art/bbA/p2_tire_swing_tree.webp",
   "w": 1111.3267326732673,
   "h": 1100,
   "native": [
    2551,
    2525
   ],
   "group": "structure"
  },
  "p2_tree_big_round": {
   "src": "art/bbA/p2_tree_big_round.webp",
   "w": 1149.548311076198,
   "h": 1150,
   "native": [
    2545,
    2546
   ],
   "group": "structure"
  },
  "p2_tree_medium": {
   "src": "art/bbA/p2_tree_medium.webp",
   "w": 956.0807483998032,
   "h": 950,
   "native": [
    2044,
    2031
   ],
   "group": "structure"
  },
  "p2_tree_wide_oak": {
   "src": "art/bbA/p2_tree_wide_oak.webp",
   "w": 1230.1826846703732,
   "h": 1100,
   "native": [
    2816,
    2518
   ],
   "group": "structure"
  },
  "p2_wheelbarrow_flowers": {
   "src": "art/bbA/p2_wheelbarrow_flowers.webp",
   "w": 287.1065493646139,
   "h": 230,
   "native": [
    1277,
    1023
   ],
   "group": "greenery"
  }
 },
 "characters": {
  "rambo": {
   "src": "art/v5/bobo.png",
   "w": 442.4343675417661,
   "h": 620,
   "native": [
    897,
    1257
   ],
   "contact": [
    [
     -0.37,
     -0.024,
     0.105
    ],
    [
     -0.13,
     -0.005,
     0.12
    ],
    [
     0.11,
     -0.072,
     0.11
    ],
    [
     0.37,
     -0.035,
     0.1
    ]
   ]
  },
  "buck": {
   "src": "approved/a/home/L06_buck.png",
   "w": 558.2990397805213,
   "h": 1100,
   "native": [
    370,
    729
   ],
   "contact": [
    [
     -0.32,
     -0.01,
     0.065
    ],
    [
     -0.1,
     -0.04,
     0.06
    ],
    [
     0.17,
     0,
     0.065
    ],
    [
     0.35,
     -0.03,
     0.06
    ]
   ]
  },
  "bunny": {
   "src": "approved/a/home/L07_bunny.png",
   "w": 162.4907063197026,
   "h": 310,
   "native": [
    282,
    538
   ],
   "contact": [
    [
     -0.18,
     -0.008,
     0.15
    ],
    [
     0.18,
     -0.008,
     0.15
    ]
   ]
  },
  "cardinal": {
   "src": "approved/a/home/L09_cardinal.png",
   "w": 78.125,
   "h": 105,
   "native": [
    250,
    336
   ]
  }
 },
 "markers": {
  "completed": "approved/a/world/marker_completed_grounded.png",
  "current": "approved/a/world/marker_current_grounded.png",
  "locked": "approved/a/world/marker_locked_grounded.png"
 },
 "star": "approved/a/map2/star_gold_512.png",
 "markerWidth": 300,
 "cardinalPerch": 110.4,
 "ui": {
  "L02_heart_counter": "approved/a/home/L02_heart_counter.png",
  "L03_bone_counter": "approved/a/home/L03_bone_counter.png",
  "L04_gear": "approved/a/home/L04_gear.png",
  "L13_bottom_bar": "approved/a/home/L13_bottom_bar.png",
  "L14_active_home_tile": "approved/a/home/L14_active_home_tile.png",
  "L17_nav_toys": "approved/a/home/L17_nav_toys.png",
  "L18_nav_friends": "approved/a/home/L18_nav_friends.png",
  "L19_nav_shop": "approved/a/home/L19_nav_shop.png",
  "banner": "approved/a/map2/chapter_banner_blank_1290x500.png",
  "L15_nav_home": "approved/a/map2/nav_home_white.png",
  "L16_nav_map": "approved/a/map2/nav_map_teal.png"
 },
 "props": [
  {
   "type": "p2_rose_bush",
   "x": 810,
   "s": 2850,
   "w": 303.76119402985074,
   "h": 240,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_hedge",
   "x": -180,
   "s": 3390,
   "w": 548.40625,
   "h": 230,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_hedge",
   "x": 960,
   "s": 3390,
   "w": 548.40625,
   "h": 230,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_mailbox",
   "x": 1250,
   "s": 7000,
   "w": 273.016894609815,
   "h": 420,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_lamp_post",
   "x": 570,
   "s": 7060,
   "w": 241.7277486910995,
   "h": 760,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_hedge",
   "x": 1470,
   "s": 6610,
   "w": 548.40625,
   "h": 230,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_bush_flowers",
   "x": 460,
   "s": 6610,
   "w": 308.57142857142856,
   "h": 240,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_fence_segment",
   "x": -234.57417582417582,
   "s": 3150,
   "w": 799.1483516483516,
   "h": 380,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_fence_segment",
   "x": 1014.5741758241759,
   "s": 3150,
   "w": 799.1483516483516,
   "h": 380,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_fence_segment",
   "x": 1793.7225274725274,
   "s": 3150,
   "w": 799.1483516483516,
   "h": 380,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_post_left",
   "x": 155,
   "s": 3145,
   "w": 146.1345852895149,
   "h": 460,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_post_right",
   "x": 625,
   "s": 3145,
   "w": 146.1345852895149,
   "h": 460,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_leaf_left",
   "x": 288.7866772402855,
   "s": 3010,
   "w": 257.57335448057097,
   "h": 400,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_leaf_right",
   "x": 507.92423046566694,
   "s": 3010,
   "w": 224.15153906866612,
   "h": 400,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_fence_segment",
   "x": 275.4258241758242,
   "s": 6850,
   "w": 799.1483516483516,
   "h": 380,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_fence_segment",
   "x": -503.7225274725275,
   "s": 6850,
   "w": 799.1483516483516,
   "h": 380,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_fence_segment",
   "x": 1524.5741758241759,
   "s": 6850,
   "w": 799.1483516483516,
   "h": 380,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_post_left",
   "x": 665,
   "s": 6845,
   "w": 146.1345852895149,
   "h": 460,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_post_right",
   "x": 1135,
   "s": 6845,
   "w": 146.1345852895149,
   "h": 460,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_leaf_left",
   "x": 798.7866772402855,
   "s": 6710,
   "w": 257.57335448057097,
   "h": 400,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_gate_leaf_right",
   "x": 1017.9242304656669,
   "s": 6710,
   "w": 224.15153906866612,
   "h": 400,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_tree_big_round",
   "x": -326,
   "s": 350,
   "w": 1149.548311076198,
   "h": 1150,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "bb_flrock",
   "x": 1380,
   "s": 260,
   "w": 342.69896193771626,
   "h": 240,
   "flip": false,
   "group": "detail"
  },
  {
   "type": "bb_dog",
   "x": -69,
   "s": 700,
   "w": 915.0089126559714,
   "h": 820,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "bb_rock",
   "x": 1286,
   "s": 1250,
   "w": 331.57894736842104,
   "h": 170,
   "flip": false,
   "group": "detail"
  },
  {
   "type": "bb_bush",
   "x": -73,
   "s": 1630,
   "w": 375.3,
   "h": 270,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_tree_wide_oak",
   "x": 1458,
   "s": 1950,
   "w": 1230.1826846703732,
   "h": 1100,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "bb_fern",
   "x": 1080,
   "s": 2340,
   "w": 285.6043956043956,
   "h": 230,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_tree_big_round",
   "x": 1616,
   "s": 4050,
   "w": 1149.548311076198,
   "h": 1150,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_tire_swing_tree",
   "x": -394,
   "s": 5150,
   "w": 1111.3267326732673,
   "h": 1100,
   "flip": false,
   "group": "structure"
  },
  {
   "type": "p2_birdbath",
   "x": 1267,
   "s": 5250,
   "w": 327.9012345679012,
   "h": 400,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_wheelbarrow_flowers",
   "x": 1391,
   "s": 5910,
   "w": 287.1065493646139,
   "h": 230,
   "flip": false,
   "group": "greenery"
  },
  {
   "type": "p2_lavender_row",
   "x": 175,
   "s": 6000,
   "w": 315.6262425447316,
   "h": 210,
   "flip": false,
   "group": "greenery"
  }
 ],
 "reviewPositions": {
  "X1": [
   -900,
   -200,
   500,
   1200,
   2000,
   2800,
   3400,
   4000
  ],
  "X2": [
   2800,
   3500,
   4200,
   4900,
   5700,
   6500,
   7100,
   7700
  ]
 },
 "plantGroups": {
  "greenery": [
   "boxwood",
   "fern",
   "hosta"
  ],
  "white_yellow": [
   "daisies"
  ],
  "blue_purple": [
   "lavender",
   "blue_hydrangea"
  ],
  "orange_red": [
   "marigolds",
   "red_tulips"
  ],
  "pink": [
   "pink_hydrangea"
  ],
  "detail": [
   "pot",
   "watering_can",
   "hose",
   "bone_toy",
   "mushrooms",
   "leaf_pile",
   "stepping_stones"
  ]
 },
 "seeds": {
  "A": 6011,
  "B": 6207
 },
 "futureConnectors": {
  "Neighborhood": "crosswalk + lamp posts",
  "Vet Visit": "brick plaza archway",
  "Rainy Day": "wooden bridge over stream (v5 bridge source retained outside active chapter)",
  "Grammy\u2019s House": "flowered arbor over stone path"
 },
 "chapterTransitionRule": "bottom half outgoing terrain, top half incoming terrain; retain route footprint; no future chapter art generated",
 "identityLock": "Approved v5 standing Rambo, Mr Buck, bunny, cardinal and shared UI files retained byte for byte. Shadow-removal generation was rejected because it redrew Rambo.",
 "cardinalRock": "perch_rock",
 "castPlacement": {
  "rambo": {
   "xOffset": 380,
   "minX": 330,
   "maxX": 1040,
   "sOffset": -65
  },
  "buck": {
   "xOffset": -270,
   "minX": 260,
   "maxX": 1030,
   "sOffset": -500
  },
  "bunny": {
   "xOffset": 650,
   "minX": 190,
   "maxX": 1130,
   "sOffset": 680
  },
  "cardinal": {
   "xOffset": 620,
   "minX": 180,
   "maxX": 1120,
   "sOffset": -500
  }
 },
 "compositionNote": "Scene-by-scene world anchors spread friends through the yard. Layout checks reserve readable markers and visible faces; camera browsing never changes cast placements.",
 "castAnchors": {
  "1": {
   "face": -1,
   "rambo": {
    "x": 534,
    "s": 320
   },
   "buck": {
    "x": 923,
    "s": 1640
   },
   "bunny": {
    "x": 520,
    "s": 640
   },
   "cardinal": {
    "x": 270,
    "s": 730
   }
  },
  "2": {
   "face": -1,
   "rambo": {
    "x": 543,
    "s": 820
   },
   "buck": {
    "x": 923,
    "s": 1640
   },
   "bunny": {
    "x": 520,
    "s": 640
   },
   "cardinal": {
    "x": 270,
    "s": 730
   }
  },
  "3": {
   "face": 1,
   "rambo": {
    "x": 994,
    "s": 1320
   },
   "buck": {
    "x": 460,
    "s": 640
   },
   "bunny": {
    "x": 863,
    "s": 1640
   },
   "cardinal": {
    "x": 1113,
    "s": 1730
   }
  },
  "4": {
   "face": 1,
   "rambo": {
    "x": 724,
    "s": 1820
   },
   "buck": {
    "x": 460,
    "s": 640
   },
   "bunny": {
    "x": 863,
    "s": 1640
   },
   "cardinal": {
    "x": 1113,
    "s": 1730
   }
  },
  "5": {
   "face": 1,
   "rambo": {
    "x": 771,
    "s": 2320
   },
   "buck": {
    "x": 460,
    "s": 640
   },
   "bunny": {
    "x": 863,
    "s": 1640
   },
   "cardinal": {
    "x": 1113,
    "s": 1730
   }
  },
  "6": {
   "face": 1,
   "rambo": {
    "x": 756,
    "s": 4020
   },
   "buck": {
    "x": 367,
    "s": 5340
   },
   "bunny": {
    "x": 770,
    "s": 4340
   },
   "cardinal": {
    "x": 1020,
    "s": 4430
   }
  },
  "7": {
   "face": 1,
   "rambo": {
    "x": 747,
    "s": 4520
   },
   "buck": {
    "x": 367,
    "s": 5340
   },
   "bunny": {
    "x": 770,
    "s": 4340
   },
   "cardinal": {
    "x": 1020,
    "s": 4430
   }
  },
  "8": {
   "face": -1,
   "rambo": {
    "x": 296,
    "s": 5020
   },
   "buck": {
    "x": 830,
    "s": 4340
   },
   "bunny": {
    "x": 427,
    "s": 5340
   },
   "cardinal": {
    "x": 177,
    "s": 5430
   }
  },
  "9": {
   "face": -1,
   "rambo": {
    "x": 566,
    "s": 5520
   },
   "buck": {
    "x": 830,
    "s": 4340
   },
   "bunny": {
    "x": 427,
    "s": 5340
   },
   "cardinal": {
    "x": 177,
    "s": 5430
   }
  },
  "10": {
   "face": -1,
   "rambo": {
    "x": 519,
    "s": 6020
   },
   "buck": {
    "x": 830,
    "s": 4340
   },
   "bunny": {
    "x": 427,
    "s": 5340
   },
   "cardinal": {
    "x": 177,
    "s": 5430
   }
  },
  "11": {
   "face": -1,
   "rambo": {
    "x": 534,
    "s": 7720
   },
   "buck": {
    "x": 923,
    "s": 9040
   },
   "bunny": {
    "x": 520,
    "s": 8040
   },
   "cardinal": {
    "x": 270,
    "s": 8130
   }
  },
  "12": {
   "face": -1,
   "rambo": {
    "x": 543,
    "s": 8220
   },
   "buck": {
    "x": 923,
    "s": 9040
   },
   "bunny": {
    "x": 520,
    "s": 8040
   },
   "cardinal": {
    "x": 270,
    "s": 8130
   }
  },
  "13": {
   "face": 1,
   "rambo": {
    "x": 994,
    "s": 8720
   },
   "buck": {
    "x": 460,
    "s": 8040
   },
   "bunny": {
    "x": 863,
    "s": 9040
   },
   "cardinal": {
    "x": 1113,
    "s": 9130
   }
  },
  "14": {
   "face": 1,
   "rambo": {
    "x": 724,
    "s": 9220
   },
   "buck": {
    "x": 460,
    "s": 8040
   },
   "bunny": {
    "x": 863,
    "s": 9040
   },
   "cardinal": {
    "x": 1113,
    "s": 9130
   }
  },
  "15": {
   "face": 1,
   "rambo": {
    "x": 771,
    "s": 9720
   },
   "buck": {
    "x": 460,
    "s": 8040
   },
   "bunny": {
    "x": 863,
    "s": 9040
   },
   "cardinal": {
    "x": 1113,
    "s": 9130
   }
  },
  "16": {
   "face": 1,
   "rambo": {
    "x": 756,
    "s": 11420
   },
   "buck": {
    "x": 367,
    "s": 12740
   },
   "bunny": {
    "x": 770,
    "s": 11740
   },
   "cardinal": {
    "x": 1020,
    "s": 11830
   }
  },
  "17": {
   "face": 1,
   "rambo": {
    "x": 747,
    "s": 11920
   },
   "buck": {
    "x": 367,
    "s": 12740
   },
   "bunny": {
    "x": 770,
    "s": 11740
   },
   "cardinal": {
    "x": 1020,
    "s": 11830
   }
  },
  "18": {
   "face": -1,
   "rambo": {
    "x": 296,
    "s": 12420
   },
   "buck": {
    "x": 830,
    "s": 11740
   },
   "bunny": {
    "x": 427,
    "s": 12740
   },
   "cardinal": {
    "x": 177,
    "s": 12830
   }
  },
  "19": {
   "face": -1,
   "rambo": {
    "x": 566,
    "s": 12920
   },
   "buck": {
    "x": 830,
    "s": 11740
   },
   "bunny": {
    "x": 427,
    "s": 12740
   },
   "cardinal": {
    "x": 177,
    "s": 12830
   }
  },
  "20": {
   "face": -1,
   "rambo": {
    "x": 519,
    "s": 13420
   },
   "buck": {
    "x": 830,
    "s": 11740
   },
   "bunny": {
    "x": 427,
    "s": 12740
   },
   "cardinal": {
    "x": 177,
    "s": 12830
   }
  },
  "21": {
   "face": -1,
   "rambo": {
    "x": 534,
    "s": 15120
   },
   "buck": {
    "x": 923,
    "s": 16440
   },
   "bunny": {
    "x": 520,
    "s": 15440
   },
   "cardinal": {
    "x": 270,
    "s": 15530
   }
  },
  "22": {
   "face": -1,
   "rambo": {
    "x": 543,
    "s": 15620
   },
   "buck": {
    "x": 923,
    "s": 16440
   },
   "bunny": {
    "x": 520,
    "s": 15440
   },
   "cardinal": {
    "x": 270,
    "s": 15530
   }
  },
  "23": {
   "face": 1,
   "rambo": {
    "x": 994,
    "s": 16120
   },
   "buck": {
    "x": 460,
    "s": 15440
   },
   "bunny": {
    "x": 863,
    "s": 16440
   },
   "cardinal": {
    "x": 1113,
    "s": 16530
   }
  },
  "24": {
   "face": 1,
   "rambo": {
    "x": 724,
    "s": 16620
   },
   "buck": {
    "x": 460,
    "s": 15440
   },
   "bunny": {
    "x": 863,
    "s": 16440
   },
   "cardinal": {
    "x": 1113,
    "s": 16530
   }
  },
  "25": {
   "face": 1,
   "rambo": {
    "x": 771,
    "s": 17120
   },
   "buck": {
    "x": 460,
    "s": 15440
   },
   "bunny": {
    "x": 863,
    "s": 16440
   },
   "cardinal": {
    "x": 1113,
    "s": 16530
   }
  },
  "26": {
   "face": 1,
   "rambo": {
    "x": 756,
    "s": 18820
   },
   "buck": {
    "x": 367,
    "s": 20140
   },
   "bunny": {
    "x": 770,
    "s": 19140
   },
   "cardinal": {
    "x": 1020,
    "s": 19230
   }
  },
  "27": {
   "face": 1,
   "rambo": {
    "x": 747,
    "s": 19320
   },
   "buck": {
    "x": 367,
    "s": 20140
   },
   "bunny": {
    "x": 770,
    "s": 19140
   },
   "cardinal": {
    "x": 1020,
    "s": 19230
   }
  },
  "28": {
   "face": -1,
   "rambo": {
    "x": 296,
    "s": 19820
   },
   "buck": {
    "x": 830,
    "s": 19140
   },
   "bunny": {
    "x": 427,
    "s": 20140
   },
   "cardinal": {
    "x": 177,
    "s": 20230
   }
  },
  "29": {
   "face": -1,
   "rambo": {
    "x": 566,
    "s": 20320
   },
   "buck": {
    "x": 830,
    "s": 19140
   },
   "bunny": {
    "x": 427,
    "s": 20140
   },
   "cardinal": {
    "x": 177,
    "s": 20230
   }
  },
  "30": {
   "face": -1,
   "rambo": {
    "x": 519,
    "s": 20820
   },
   "buck": {
    "x": 830,
    "s": 19140
   },
   "bunny": {
    "x": 427,
    "s": 20140
   },
   "cardinal": {
    "x": 177,
    "s": 20230
   }
  }
 },
 "roadHalfWidth": 210,
 "designStatus": "Backyard paint-kit A+B+XL+XR preview"
};
