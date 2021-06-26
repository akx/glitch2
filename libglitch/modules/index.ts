/* eslint-disable camelcase */
import * as fastfilter from './fastfilter';
import afterimage from './afterimage';
import bitbang from './bitbang';
import bloom from './bloom';
import buffer_load from './buffer_load';
import buffer_save from './buffer_save';
import desolve from './desolve';
import elastic from './elastic';
import from_ycbcr from './from_ycbcr';
import jpeg from './jpeg';
import leak from './leak';
import noise from './noise';
import scanlines from './scanlines';
import sliceglitch from './sliceglitch';
import slicerep from './slicerep';
import streak from './streak';
import to_ycbcr from './to_ycbcr';
import tv_displacement from './tv_displacement';
import tvscan from './tvscan';
import xform from './xform';

export default {
  afterimage,
  bitbang,
  bloom,
  buffer_load,
  buffer_save,
  desolve,
  elastic,
  ffblur: fastfilter.blur,
  ffbrightness: fastfilter.brightness,
  ffcontrast: fastfilter.contrast,
  ffhue: fastfilter.hue,
  ffsaturate: fastfilter.saturate,
  from_ycbcr,
  jpeg,
  leak,
  noise,
  scanlines,
  sliceglitch,
  slicerep,
  streak,
  to_ycbcr,
  tv_displacement,
  tvscan,
  xform,
};
