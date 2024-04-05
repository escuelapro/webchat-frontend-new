import React, { Component, createRef, memo, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import html2canvas from 'html2canvas'
import { FormattedMessage } from 'react-intl'

import observe, { emitData } from '@/utils/observers'
import TextArea from '@/components/Chat/Compose/TextArea'

import styled from './styled'

const Div = styled()
// @ts-ignore
if (!window.__arsfChatEmmitter) {
  // @ts-ignore
  window.__arsfChatEmmitter = (txt: string) => {
    // @ts-ignore
    emitData('__arsfChatEmmitter', txt)
  }
}
let rd = 90
let lastScrollHeight = 0
let firstHeight = false
// @ts-ignore
function OnInput () {
// @ts-ignore
  // eslint-disable-next-line no-mixed-operators
  if ((this.value.trim().length === 0) || !firstHeight || this.value.length < 26 && !this.value.match('\n')) {
    firstHeight = true
    // @ts-ignore
    if (this.value.trim().length === 0) this.value = this.value.replace(/\n+/, '')
    // @ts-ignore
    this.style.height = '24px'
    return
  }
  // @ts-ignore
  this.style.height = 'auto'
  // @ts-ignore
  this.style.height = (this.scrollHeight) + 'px'
  // @ts-ignore
  const c = document.querySelector('.abs-w-c-btm-form form.compose textarea')
  // @ts-ignore
  if (lastScrollHeight < this.scrollHeight) {
    rd -= 20
    if (rd > 10) {
      // @ts-ignore
      c.style.borderRadius = `${rd}px`
    }
    // @ts-ignore
    lastScrollHeight = this.scrollHeight
  }
}
interface Prop {
  onClick: any;
}
const ScreenshotButton = ({ onClick }: Prop) => {
  const pageRef = useRef(null)

  const handleScreenshot = async () => {
    const canvas = await html2canvas(document.body)
    const dataURL = canvas.toDataURL('image/png')
    onClick(dataURL)
  }

  return (
    <div ref={pageRef}>
      <button onClick={handleScreenshot} className='screenshot-button' />
    </div>
  )
}
interface Props {
  send: any;
}
class Compose extends Component<Props, any> {
  private readonly rel: React.RefObject<any>

  state = { img: false }

  constructor (p: Props) {
    super(p)
    // eslint-disable-next-line no-unused-expressions
    this.rel = createRef<any>()
    // @ts-ignore
    window.__arsfChatEmmitter.bind(this)()
    this.state = {
      img: false,
    }
  }

  componentDidMount () {
    // @ts-ignore
    const current = this.rel?.current
    if (current) {
      current.addEventListener('input', OnInput, false)
    }

    const name = '__arsfChatEmmitter'
    observe(name, {
      [name]: this.send.bind(this),
    })
  }

  componentWillUnmount () {
    this.unobserve()
  }

  unobserve () {
    observe('')
  }

  send = (e) => {
    if (e) {
      const el = e.target
      const v = `${el.value}`.trim()
      if (v) {
        this.props.send({ text: v })
      }
      el.value = ''
    }
  }

  handleTest = (e) => {
    e.preventDefault()
    return false
  }

  handleCancelImg = () => {
    this.setState({ img: false })
  }

  handleScreenSend = (dataUrl) => {
    this.setState({ img: dataUrl })
  }

  handleScreenSendToServer = () => {
    const imgData = this.state.img
    this.setState({ img: '' }, () => {
      this.props.send({ img: imgData })
    })
  }

  render () {
    return (
      <Div className='abs-w-c-btm-form'>
        {this.state.img
          ? (
            <div className='send-screen-wrap'>
              <div className='send-screen-title'>
                <FormattedMessage id='screen' />
              </div>
              <div className='send-screen'>
                <button type='button' onClick={this.handleScreenSendToServer}><FormattedMessage id='yes' /></button>
                <button type='button' onClick={this.handleCancelImg}><FormattedMessage id='no' /></button>
              </div>
            </div>
            )
          : null}
        <form onSubmit={this.handleTest} className='compose'>
          <ScreenshotButton onClick={this.handleScreenSend} />
          <TextArea rel={this.rel} send={this.send} />
          <div className='send'>
            <button
              className='btn btn-ghost-success img send-btn'
              onClick={() => this.send({ target: this.rel?.current })}
            >
              <span />
            </button>
          </div>
        </form>
      </Div>
    )
  }
}

const mapStateToProps = createStructuredSelector({})

export function mapDispatchToProps (dispatch: any) {
  return {
    send: (textObj, userId) => dispatch({ ...textObj, type: 'messages_test', userId }),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withConnect,
  memo,
)(Compose) as any
