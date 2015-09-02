// This file was autogenerated by ./assets/js/thirdparty/closure-library/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../../../../project/apps/main.js', ['gux.apps.Main'], ['goog.dom', 'goog.dom.query', 'goog.fx.anim', 'goog.userAgent', 'gux.controllers.FullscreenLoader', 'gux.controllers.Header', 'gux.controllers.Intro', 'gux.controllers.MainScroller', 'gux.controllers.PortfolioNavigation', 'gux.controllers.Router', 'gux.controllers.Shortcuts'], false);
goog.addDependency('../../../../project/controllers/assets.js', ['gux.controllers.Assets'], [], false);
goog.addDependency('../../../../project/controllers/contactform.js', ['gux.controllers.ContactForm'], ['goog.async.Delay', 'goog.dom.classlist', 'goog.dom.forms', 'goog.events.EventHandler', 'goog.events.EventTarget', 'goog.format.EmailAddress', 'goog.net.XhrIo'], false);
goog.addDependency('../../../../project/controllers/fullscreenloader.js', ['gux.controllers.FullscreenLoader'], ['goog.events.EventHandler', 'goog.events.EventTarget', 'goog.userAgent', 'gux.events', 'gux.fx.Shape', 'gux.templates.Main'], false);
goog.addDependency('../../../../project/controllers/header.js', ['gux.controllers.Header'], ['goog.dom.classlist', 'gux.controllers.ImageViewer', 'gux.events'], false);
goog.addDependency('../../../../project/controllers/imageviewer.js', ['gux.controllers.ImageViewer'], ['goog.events.EventHandler', 'goog.events.EventTarget', 'goog.events.MouseWheelHandler', 'goog.fx.Dragger', 'goog.style', 'goog.userAgent', 'gux.Utils', 'gux.events', 'gux.templates.Main'], false);
goog.addDependency('../../../../project/controllers/intro.js', ['gux.controllers.Intro'], ['goog.events.EventHandler', 'goog.events.EventTarget', 'goog.math.Size', 'goog.net.XhrIo', 'gux.controllers.Loader', 'gux.fx.Shape'], false);
goog.addDependency('../../../../project/controllers/loader.js', ['gux.controllers.Loader'], ['goog.events.EventTarget', 'goog.net.ImageLoader', 'gux.controllers.Assets', 'gux.events'], false);
goog.addDependency('../../../../project/controllers/mainscroller.js', ['gux.controllers.MainScroller'], ['goog.events.EventHandler', 'goog.events.EventTarget', 'gux.fx.DummyScroller'], false);
goog.addDependency('../../../../project/controllers/modules/comparison.js', ['gux.controllers.modules.Comparison'], ['goog.fx.Dragger', 'gux.controllers.Module'], false);
goog.addDependency('../../../../project/controllers/modules/intro.js', ['gux.controllers.modules.Intro'], ['gux.controllers.Module'], false);
goog.addDependency('../../../../project/controllers/modules/module.js', ['gux.controllers.Module'], ['goog.events.EventHandler', 'goog.events.EventTarget'], false);
goog.addDependency('../../../../project/controllers/modules/videoplayer.js', ['gux.controllers.modules.VideoPlayer'], ['goog.fx.Dragger', 'gux.controllers.Module'], false);
goog.addDependency('../../../../project/controllers/modules/workflow.js', ['gux.controllers.modules.Workflow'], ['goog.fx.Dragger', 'gux.controllers.Module'], false);
goog.addDependency('../../../../project/controllers/pages/labspage.js', ['gux.controllers.pages.LabsPage'], ['gux.controllers.pages.Page', 'gux.fx.Shape'], false);
goog.addDependency('../../../../project/controllers/pages/page.js', ['gux.controllers.pages.Page'], ['goog.async.Throttle', 'goog.dom.classlist', 'goog.events.EventHandler', 'goog.events.EventTarget', 'goog.events.MouseWheelHandler', 'goog.net.XhrIo', 'gux.controllers.ContactForm', 'gux.controllers.modules.VideoPlayer', 'gux.fx.LazyLoader', 'gux.fx.Sticky'], false);
goog.addDependency('../../../../project/controllers/pages/projectpage.js', ['gux.controllers.pages.ProjectPage'], ['gux.Utils', 'gux.controllers.ImageViewer', 'gux.controllers.modules.Comparison', 'gux.controllers.modules.Intro', 'gux.controllers.modules.Workflow', 'gux.controllers.pages.Page'], false);
goog.addDependency('../../../../project/controllers/portfolionavigation.js', ['gux.controllers.PortfolioNavigation'], ['goog.events.EventHandler', 'goog.fx.easing', 'goog.math.Size'], false);
goog.addDependency('../../../../project/controllers/router.js', ['gux.controllers.Router'], ['goog.Uri', 'goog.async.Deferred', 'goog.async.DeferredList', 'goog.events.EventTarget', 'goog.history.Html5History', 'goog.net.ImageLoader', 'goog.net.XhrIo', 'goog.object', 'gux.Utils', 'gux.controllers.pages.LabsPage', 'gux.controllers.pages.Page', 'gux.controllers.pages.ProjectPage'], false);
goog.addDependency('../../../../project/controllers/shortcuts.js', ['gux.controllers.Shortcuts'], ['goog.events', 'goog.ui.KeyboardShortcutHandler'], false);
goog.addDependency('../../../../project/events/events.js', ['gux.events'], ['goog.userAgent'], false);
goog.addDependency('../../../../project/fx/dummyscroller.js', ['gux.fx.DummyScroller'], ['goog.async.Delay', 'goog.dom', 'goog.events.EventHandler', 'goog.events.EventTarget', 'goog.fx.Dragger', 'goog.math.Box', 'goog.math.Size', 'goog.userAgent', 'gux.events'], false);
goog.addDependency('../../../../project/fx/lazyloader.js', ['gux.fx.LazyLoader'], ['goog.Disposable', 'goog.dom', 'goog.style', 'gux.Utils'], false);
goog.addDependency('../../../../project/fx/shape.js', ['gux.fx.Shape'], ['goog.math'], false);
goog.addDependency('../../../../project/fx/sticky.js', ['gux.fx.Sticky'], ['goog.Disposable', 'goog.dom', 'goog.style'], false);
goog.addDependency('../../../../project/gux.js', ['gux'], ['gux.apps.Main'], false);
goog.addDependency('../../../../project/templates/main.soy.js', ['gux.templates.Main'], ['soy', 'soydata'], false);
goog.addDependency('../../../../project/templates/soyutils_usegoog.js', ['soy', 'soy.StringBuilder', 'soy.esc', 'soydata', 'soydata.SanitizedHtml', 'soydata.SanitizedHtmlAttribute', 'soydata.SanitizedJs', 'soydata.SanitizedJsStrChars', 'soydata.SanitizedUri', 'soydata.VERY_UNSAFE'], ['goog.asserts', 'goog.dom.DomHelper', 'goog.format', 'goog.i18n.BidiFormatter', 'goog.i18n.bidi', 'goog.soy', 'goog.soy.data.SanitizedContentKind', 'goog.string', 'goog.string.StringBuffer'], false);
goog.addDependency('../../../../project/utils.js', ['gux.Utils'], ['goog.Uri', 'goog.dom', 'goog.string', 'goog.window'], false);
