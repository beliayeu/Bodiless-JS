# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.51](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.50...v0.0.51) (2020-07-01)


### Features

* **core, ui:** Notify of Upstream Changes in Edit Environment ([#368](https://github.com/johnsonandjohnson/bodiless-js/issues/368)) ([769d1dc](https://github.com/johnsonandjohnson/bodiless-js/commit/769d1dc1fecbbe2ca892685ff9094b7f0066f4b4))





## [0.0.50](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.49...v0.0.50) (2020-06-12)


### Features

* **gatsby-theme-bodiless, components, core, layouts:** Add labels and update icons for admin menu ([#361](https://github.com/johnsonandjohnson/bodiless-js/issues/361)) ([93e7033](https://github.com/johnsonandjohnson/bodiless-js/commit/93e70339b804824f167fdf53df4cca042c5ba6c0))





## [0.0.49](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.48...v0.0.49) (2020-06-08)


### Features

* **core, ui:**  Notifications/Alerts. ([#346](https://github.com/johnsonandjohnson/bodiless-js/issues/346)) ([136abd3](https://github.com/johnsonandjohnson/bodiless-js/commit/136abd355ed7a99deb6e21718a3d6aaf5041c898)), closes [#300](https://github.com/johnsonandjohnson/bodiless-js/issues/300)
* **gatsby-theme-bodiless:** Merge Production Changes on Pull ([#353](https://github.com/johnsonandjohnson/bodiless-js/issues/353)) ([4c6808e](https://github.com/johnsonandjohnson/bodiless-js/commit/4c6808e73b91da665c87e58ec35a36fd6574793f))





## [0.0.48](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.47...v0.0.48) (2020-05-20)


### Features

* **gatsby-theme-bodiless:** pull upstream changes. ([78a2050](https://github.com/johnsonandjohnson/bodiless-js/commit/78a2050adbb6498cc15d1d1184e068130a61d356)), closes [#303](https://github.com/johnsonandjohnson/bodiless-js/issues/303) [#303](https://github.com/johnsonandjohnson/bodiless-js/issues/303)





## [0.0.47](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.46...v0.0.47) (2020-04-22)


### Features

* **core:** component default content ([#219](https://github.com/johnsonandjohnson/bodiless-js/issues/219)) ([379e655](https://github.com/johnsonandjohnson/bodiless-js/commit/379e6559de3471214e45132ed493deed63ecfb38))





## [0.0.46](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.45...v0.0.46) (2020-04-08)

**Note:** Version bump only for package @bodiless/gatsby-theme-bodiless





## [0.0.45](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.44...v0.0.45) (2020-04-08)


### Features

* **core-ui:** Implement reusable modal overlay and use in create page & … ([#216](https://github.com/johnsonandjohnson/bodiless-js/issues/216)) ([230334e](https://github.com/johnsonandjohnson/bodiless-js/commit/230334eca8a99ecb05be486c28372f9e5835b975))





## [0.0.44](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.43...v0.0.44) (2020-03-26)


### Features

* **components:**  Add google tag manager &  datalayer. ([#207](https://github.com/johnsonandjohnson/bodiless-js/issues/207)) ([9ee52e3](https://github.com/johnsonandjohnson/bodiless-js/commit/9ee52e39741004d263a5c06055520b197947f942))
* **gatsby-theme-bodiless, starter, test-site:** purge unused css ([#195](https://github.com/johnsonandjohnson/bodiless-js/issues/195)) ([1b54d82](https://github.com/johnsonandjohnson/bodiless-js/commit/1b54d82e53d0d72291a2ed3273e5b853c182e299))
* **gatsby-theme, backend, core, richtext, components, organisms:** Deleted Data Should Not be Retained ([#144](https://github.com/johnsonandjohnson/bodiless-js/issues/144)) ([0821c89](https://github.com/johnsonandjohnson/bodiless-js/commit/0821c897b1e6894c418ec78bac58fccdb969caa7)), closes [#14](https://github.com/johnsonandjohnson/bodiless-js/issues/14)


### BREAKING CHANGES

* **gatsby-theme-bodiless, starter, test-site:** bodiless/components does not export Link component anymore. One, who consumes Link component, should replace Link with a site level link component.
* **gatsby-theme, backend, core, richtext, components, organisms:** 1. Submenu data model changed. The first reason is to make menu/submenu data model similar to list/sublist data models, so that menu/submenu can leverage api provided by list component. The second reason is to solve a submenu bug in which one json file stores data from multiple nodes. Particularly, submenu item stores toggle and a list sublist items. One, who has a submenu on a site, will have to either update existing submenu json files or recreate submenu. Example how to update submenu json files of existing site is demonstrated on the demo site. pr 41.
2. Accordion changes. Node is removed from SingleAccordionClean. The reason is to provide consumers more control over how the node is added to accordion. Particularly, this change was needed for burgermenu, which leverages accordions, so that burgermenu can read submenu data from accurate node. One, who uses SingleAccordionClean to compose custom accordions, should inject node to the custom accordions. Example can be found in test-site/src/components/SingleAccordion/index.tsx. withNode has been added to asSingleAccordion.





## [0.0.43](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.42...v0.0.43) (2020-03-11)

**Note:** Version bump only for package @bodiless/gatsby-theme-bodiless





## [0.0.42](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.41...v0.0.42) (2020-02-28)

**Note:** Version bump only for package @bodiless/gatsby-theme-bodiless





## [0.0.41](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.40...v0.0.41) (2020-02-28)

**Note:** Version bump only for package @bodiless/gatsby-theme-bodiless





## [0.0.40](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.39...v0.0.40) (2020-02-21)


### Bug Fixes

* **gatsby-theme-bodiless:** Deleting json file for any component does not reset content ([#145](https://github.com/johnsonandjohnson/bodiless-js/issues/145)) ([b76eb6e](https://github.com/johnsonandjohnson/bodiless-js/commit/b76eb6ec61c55f0a8864e6dcbd61e2689b6c5ff1))
* **gatsby-theme-bodiless:** Fix revert does not refresh page ([#110](https://github.com/johnsonandjohnson/bodiless-js/issues/110)) ([629b3ef](https://github.com/johnsonandjohnson/bodiless-js/commit/629b3efebc28882932d3e136f385abaccd15b28d))
* **gatsby-theme-bodiless:** Typed chars disappear sporadically ([#52](https://github.com/johnsonandjohnson/bodiless-js/issues/52)) ([4829496](https://github.com/johnsonandjohnson/bodiless-js/commit/48294967948c75707b668f90c76c0ad5d18e6a4d)), closes [#14](https://github.com/johnsonandjohnson/bodiless-js/issues/14) [#14](https://github.com/johnsonandjohnson/bodiless-js/issues/14) [#14](https://github.com/johnsonandjohnson/bodiless-js/issues/14)
* **migration_tool:** issues in FAQ pages ([#126](https://github.com/johnsonandjohnson/bodiless-js/issues/126)) ([2d4a6cb](https://github.com/johnsonandjohnson/bodiless-js/commit/2d4a6cbc219682e4162c5ab77eb128dfd2048c1c))


### Features

* **core:** Alter the Main Menu in Preview Mode ([#132](https://github.com/johnsonandjohnson/bodiless-js/issues/132)) ([abebb43](https://github.com/johnsonandjohnson/bodiless-js/commit/abebb43c48668d8f147cb43c7c4f042b06abd48e))





## 0.0.39 (2020-01-30)


### Bug Fixes

* **p.sh:** Fix env vars are not generated for p.sh. ([#89](https://github.com/johnsonandjohnson/bodiless-js/issues/89)) ([c3d9ed3](https://github.com/johnsonandjohnson/bodiless-js/commit/c3d9ed3f94fe8ba707a4c6e0811e745ded4d3676))






## 0.0.38 (2020-01-29)


### Bug Fixes

* **psh:** Remove docs app from platform.sh ([#78](https://github.com/johnsonandjohnson/bodiless-js/issues/78)) ([8b19fce](https://github.com/johnsonandjohnson/bodiless-js/commit/8b19fce9df66fad21bf98488b0a71486cc84670b)), closes [#1234](https://github.com/johnsonandjohnson/bodiless-js/issues/1234) [#4567](https://github.com/johnsonandjohnson/bodiless-js/issues/4567) [#71](https://github.com/johnsonandjohnson/bodiless-js/issues/71)
* New page form freezes the screen after upgrading informed ([#75](https://github.com/johnsonandjohnson/bodiless-js/issues/75)) ([739a2a2](https://github.com/johnsonandjohnson/bodiless-js/commit/739a2a2c2fed278d8045e25807773e3b19430dac))


### Features

* **@bodiless/gatsby-theme-bodiless:** Initial Commit. ([33ab746](https://github.com/johnsonandjohnson/bodiless-js/commit/33ab746af5044c963d2a1d8a2da5e799db006626))
* **starter:** Add gatsby-starter-bodiless to monorepo ([#12](https://github.com/johnsonandjohnson/bodiless-js/issues/12)) ([f5d8d2a](https://github.com/johnsonandjohnson/bodiless-js/commit/f5d8d2af25096d5785203cb600af378a5160b33d)), closes [#7](https://github.com/johnsonandjohnson/bodiless-js/issues/7)


### BREAKING CHANGES

* **psh:** Describe the nature of the breaking change here.

More Details about the breaking change.
-->





## [0.0.37](https://github.com/johnsonandjohnson/bodiless-js/compare/v0.0.36...v0.0.37) (2020-01-17)


### Features

* **gatsby-theme-bodiless:** GH-26 Add author to commits if possible. ([#25](https://github.com/johnsonandjohnson/bodiless-js/issues/25)) ([3297c96](https://github.com/johnsonandjohnson/bodiless-js/commit/3297c96c11b14e38106201176396be59cab19a92)), closes [#26](https://github.com/johnsonandjohnson/bodiless-js/issues/26)
* **gatsby-theme-bodiless:** Remove the Pull Changes Button from the Edit UI ([#31](https://github.com/johnsonandjohnson/bodiless-js/issues/31)) ([cb5e370](https://github.com/johnsonandjohnson/bodiless-js/commit/cb5e37010d81c0902bf99140c4da3d33ee977f2e))
* **starter:** Add gatsby-starter-bodiless to monorepo ([#12](https://github.com/johnsonandjohnson/bodiless-js/issues/12)) ([242a8a4](https://github.com/johnsonandjohnson/bodiless-js/commit/242a8a420fc57bdfd3a6e0c6e99bedf672143a53)), closes [#7](https://github.com/johnsonandjohnson/bodiless-js/issues/7)
