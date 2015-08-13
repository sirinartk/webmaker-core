var React = require('react/addons');
var classNames = require('classnames');
var ColorGroup = require('../../components/color-group/color-group.jsx');
var Slider = require('../../components/range/range.jsx');
var ImageBlock = require('../../components/basic-element/types/image.jsx');

var colorChoices = ColorGroup.defaultColors.slice();
colorChoices[0] = '#444444';

var ImageEditor = React.createClass({
  mixins: [React.addons.LinkedStateMixin, require('react-intl').IntlMixin],
  getInitialState: function () {
    // Expose image handler to Android
    window.imageReady = this.imageReady;
    return ImageBlock.spec.flatten(this.props.element, {defaults: true});
  },
  componentDidUpdate: function (prevProps) {
    this.props.cacheEdits(this.state);

    // Update state if parent properties change
    if (this.props.element !== prevProps.element) {
      var state = this.getInitialState();
      this.setState(state);
    }
  },
  onChangeColor: function () {
    if (this.state.borderWidth === 0) {
      this.setState({
        borderWidth: 4
      });
    }
  },
  render: function () {
    return (
      <div id="editor">
        <div className="editor-preview">
          <ImageBlock {...this.state} />
        </div>
        <div className="editor-options">
          <div className="form-group">
            <button onClick={this.toggleMenu} className="btn btn-block">
              <img className="icon" src="../../img/change-image.svg" /> Change Image
            </button>
          </div>
          <div className="form-group">
            <label>Opacity</label>
            <Slider id="opacity" min={0} max={1} step={0.01} percentage={true} linkState={this.linkState} />
          </div>
          <div className="form-group">
            <label>Border Color</label>
            <ColorGroup id="borderColor" colors={colorChoices} onChange={this.onChangeColor} linkState={this.linkState} params={this.props.params} onLaunchTinker={this.props.save} />
          </div>
          <div className="form-group">
            <label>Border Width</label>
            <Slider id="borderWidth" max={10} unit="px" linkState={this.linkState} />
          </div>
          <div className="form-group">
            <label>Corner Radius</label>
            <Slider id="borderRadius" min={0} value={this.state.borderRadius} max={32} unit="px" linkState={this.linkState} />
          </div>
        </div>

        <div className={classNames({overlay: true, active: this.state.showMenu})} onClick={this.toggleMenu}/>
        <div className={classNames({controls: true, active: this.state.showMenu})}>
          <button hidden={window.Platform && !window.Platform.cameraIsAvailable()} onClick={this.onCameraClick}>
            <img className="icon" src="../../img/take-photo.svg" />
            <p>Take Photo</p>
          </button>
          <button onClick={this.onMediaClick}>
            <img className="icon" src="../../img/camera-gallery.svg" />
            <p>Camera Gallery</p>
          </button>
        </div>
      </div>
    );
  },
  toggleMenu: function () {
    this.setState({showMenu: !this.state.showMenu});
  },
  onCameraClick: function () {
    // Because a Pause/Resume is caused by the camera activity launching,
    // this will trigger an API call when we resume; we need to cancel this
    // in order for the new image to be loaded/saved.
    this.props.cancelDataRefresh();

    this.toggleMenu();
    if (window.Platform) {
      window.Platform.getFromCamera();
    }
  },
  onMediaClick: function () {
    // Because a Pause/Resume is caused by the camera activity launching,
    // this will trigger an API call when we resume; we need to cancel this
    // in order for the new image to be loaded/saved.
    this.props.cancelDataRefresh();

    this.toggleMenu();
    if (window.Platform) {
      window.Platform.getFromMedia();
    }
  },
  imageReady: function (uri) {
    this.setState({
      src: uri,
      loading: false
    });
  }
});

module.exports = ImageEditor;
