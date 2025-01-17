

# ToDo

* TODO add brassInfo
* TODO add rubbingInfo
* TODO leftList just one column
* TODO mv findDBservice to db.js;  db.setup just does it;  expose db.rw_avail() return T/F; delete findDB
* change server.js code from clist everywhere to leftList, etc; genericize for left_list.pug
* set RW variable for pug
* pug if RW show edit button
  * edit-button - main note area needs name tag
  * edit-button - reset main note area with raw text and editor input, and save and cancel
  * edit-button - save - raw text - common endpoint? /saveRaw?table=churches?rec=rec-num?field=mainNote?rawText='.....'
    * basically just resends post directly to vlcb2api
    * and saves in vdb? resets all 'computed' stuff (fullPic), etc
  * log the edit
* add main view gallery (just big scrolling pics)
* add info views mini gallery (thumbnails and embiggen with <- -> arrows
* server.js - compute all stuff (fullPic, markdown) for everything at beginning ?
* vlcb2api on fs1 needs to be able to push data to airtable
  * get RW AIRTABLE key
  * run
  * endpoint to save - common endpoint
  * airtable code to save
* multi-line menu - about, diaray, statistics
* move app routes to app.js (or even one per item?)
* set up utils - Object.keys;  common db patterns  (Okeys(indexes).map(to=> names)
* about page
* diary page
* blog page
* statistics
* navbar search
* leftList seach
* leftList filters
* use bundler to get better start times

* ui - favicon
* ui - better logo
* ui - navbar
* ui - main info fonts, sizes, colors













# Release
* run RW on v2 under supervisord? or fs1?
* run at flyio under new project, with /rc and nginx (no need for tailscale now)
  * new flyio project
  * ssh and get /rc/sw mounted
  * run super and nginx 
  * (this is the public RO site)
* archive other github vlcbs
* document other github etc vlcbs
