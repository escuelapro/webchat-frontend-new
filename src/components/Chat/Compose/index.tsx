// @ts-nocheck
import React, { Component, createRef, memo, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import observe, { emitData } from '../../../utils/observers'
import styled from './styled'
import html2canvas from 'html2canvas'

const Div = styled()
// @ts-ignore
if (!window.__arsfChatEmmitter) {
  // @ts-ignore
  window.__arsfChatEmmitter = (txt) => {
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
  rightItems: any;
  send: any;
}
// @ts-ignore
class Compose extends Component<Props> {
  constructor (p: Props) {
    super(p)
    // eslint-disable-next-line no-unused-expressions
    this.rel = createRef<any>(null)
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

  test = (e) => {
    e.preventDefault()
    return false
  }

  cancelImg = () => {
    this.setState({ img: '' })
  }

  screenSend = (dataUrl) => {
    this.setState({ img: dataUrl })
  }

  screenSendToServer = () => {
    const imgData = this.state.img
    this.setState({ img: '' }, () => {
      this.props.send({ img: imgData })
    })
  }

  render () {
    return (
      <Div className='abs-w-c-btm-form'>
        {!!this.state.img && (
          <div className='send-screen-wrap'>
            <div className='send-screen-title'>Вы действительно хотите отправить скриншот?</div>
            <div className='send-screen'>
              {/* eslint-disable-next-line react/jsx-handler-names */}
              <button type='button' onClick={this.screenSendToServer}>Да</button>
              {/* eslint-disable-next-line react/jsx-handler-names */}
              <button type='button' onClick={this.cancelImg}>Нет</button>
            </div>
          </div>
        )}
        {/* eslint-disable-next-line react/jsx-handler-names */}
        <form onSubmit={this.test} className='compose'>
          {/* eslint-disable-next-line react/jsx-handler-names */}
          <ScreenshotButton onClick={this.screenSend} />
          <textarea
            ref={this.rel}
            className='compose-input form-control'
            placeholder='Задайте свой вопрос'
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.keyCode === 13) {
                if (!e.ctrlKey && !e.shiftKey) {
                  this.send(e)
                }
              }
            }}
          />
          <div className='send'>
            <button
              className='btn btn-ghost-success img send-btn'
              onClick={() => this.send({ target: this.rel?.current })}
            >
              <span />
            </button>
            {this.props.rightItems}
          </div>
        </form>
      </Div>
    )
  }
}

const mapStateToProps = createStructuredSelector({})

export function mapDispatchToProps (dispatch) {
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
)(Compose)
