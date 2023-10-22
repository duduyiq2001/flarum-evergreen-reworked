import { extend, override } from "flarum/extend";
import Post from "flarum/components/Post";
import Button from "flarum/components/Button";
import icon from "flarum/helpers/icon";
import CommentPost from "flarum/components/CommentPost";

export default function MakeTree() {
  override(Post.prototype, "config", function() {
    const $actions = this.$(".Post-actions");
    const $controls = this.$(".Post-controls");

    $controls.on("click tap", function() {
      $(this).toggleClass("open");
    });
  });

  extend(Post.prototype, "oncreate", function(vdom) {
    const id = this.attrs.post.id();
    //console.log("postid", this.attrs.post.id());
    let include = "discussion,user,user.groups,hiddenUser,editedUser,";
    if (app.initializers.has("fof-gamification")) {
      include += "user.ranks,upvotes,";
    }
    if (app.initializers.has("fof/reactions")) {
      include += "reactions";
    }
    //console.log(app.store);
    //app.store.find("trees", id, { include: include.replace(/,\s*$/, "") });
    app.alerts.clear();
    app.store
      .find<Post[]>("trees", id, { include: include.replace(/,\s*$/, "") })
      .then((response) => {
        //console.log("id is ", id);
        //console.log("children", response);
        this.uniquePosts = response
          .filter(
            (thing, index, self) =>
              self.findIndex((t) => t.id() === thing.id()) === index
          )
          .sort((a, b) => {
            return a.createdAt() - b.createdAt();
          })
          .map((post) => {
            return CommentPost.component({ post });
          });
        m.redraw();
      });
    //app.alerts.clear();
    //m.redraw();
  });
  extend(Post.prototype, "view", function(vdom) {
    const id = this.attrs.post.id();
    //console.log(m.version);
    //console.log("casjbcajb");
    if (!app.cache.trees) {
      app.cache.trees = {};
      app.cache.pushTree = {};
    }
    if (!app.cache.trees[id]) {
      app.cache.trees[id] = [];
      app.cache.pushTree[id] = 0;
    }

    //if (app.cache.trees[id].length > 0) {
    /*
    console.log("redrawed2");
    m.redraw();
    let include = "discussion,user,user.groups,hiddenUser,editedUser,";
    posts = app.store
      .find("trees", id, { include: include.replace(/,\s*$/, "") })
      .then((response) => {
        console.log("id is ", id);
        console.log("children", response);
        response1 = response
          .filter(
            (thing, index, self) =>
              self.findIndex((t) => t.id() === thing.id()) === index
          )
          .sort((a, b) => {
            return a.createdAt() - b.createdAt();
          })
          .map((post) => {
            return CommentPost.component({ post });
          });
      });
    this.uniquePosts = uniquePosts;
    m.redraw();
    */
    if (app.initializers.has("fof-gamification")) {
      include += "user.ranks,upvotes,";
    }
    if (app.initializers.has("fof/reactions")) {
      include += "reactions";
    }
    if (this.uniquePosts) {
      vdom.children.push(
        <div className="CommentTree" id={id}>
          {icon("fas fa-reply")}
          {this.uniquePosts}
        </div>
      );
      //m.redraw();
    }
    /*
    if (
      this.attrs.post.replyCount() >
        app.cache.trees[id].length - app.cache.pushTree[id] ||
      (app.cache.trees[id].length === 0 && this.attrs.post.replyCount())
    ) {
      const count =
        this.attrs.post.replyCount() -
        app.cache.trees[id].length +
        app.cache.pushTree[id];
      let include = "discussion,user,user.groups,hiddenUser,editedUser,";
      if (app.initializers.has("fof-gamification")) {
        include += "user.ranks,upvotes,";
      }
      if (app.initializers.has("fof/reactions")) {
        include += "reactions";
      }
      vdom.children.push(
        Button.component(
          {
            className: "Button Button--link Evergreen--show",
            icon: "fas fa-caret-down",
            disabled: false,
            onclick: () => {
              app.store
                .find("trees", id, { include: include.replace(/,\s*$/, "") })
                .then((response) => {
                  //delete response.payload;
                  //console.log(response);
                  //m.redraw.strategy("all");
                  console.log("set to all");
                  [].push.apply(app.cache.trees[id], response);
                  console.log("tree cached", app.cache.trees[id]);
                  console.log("added to post", id);
                  //vdom.reload += 1; //force state change
                  console.log("forceredraw on ");
                  vdom.state.forceredraw = 1;
                  this.uniqueKey = Date.now();
                  console.log(this.uniqueKey);
                  this.loading = true;
                  m.redraw("true");
                  setTimeout(() => m.redraw(), 0.01);
                  setTimeout(() => m.redraw(), 0.01);
                  vdom.state.forceredraw = 0;
                  this.loading = false;
                  this.onupdate(vdom);
                  console.log("redrawed1");
                  m.redraw("true");
                  setTimeout(() => m.redraw(), 0.01);
                });
            },
          },
          app.translator.trans(
            "kyrne-evergreen.forum.post.show_" +
              (count > 1 ? "replies" : "reply"),
            { count }
          )
        )
      );
    }
    console.log("redrawed");
    m.redraw();
    */
  });
}
