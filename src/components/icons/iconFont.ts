import { h } from 'vue'
import { Icon } from '@arco-design/web-vue';

const IconFont = Icon.addFromIconFontCn({ 
  src: 'https://at.alicdn.com/t/c/font_4136370_kdxdahjtbci.js',
  extraProps:{
    type: 'icon-kuangjia',
    style: {
      fontSize: '18px',
    },
  }
});
const DynamicIconFont = props => {
  return h(IconFont, { type: props.type || 'icon-kuangjia' })
}

export default DynamicIconFont
