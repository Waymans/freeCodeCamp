class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: placeholder
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }
  render() {
    return (
       <div className='section'>
        <div className='divone'>
          <Editor input={this.state.inputValue} handleChange={this.handleChange}/>
        </div>
        <div className='divtwo'> 
          <Previewer input={this.state.inputValue}/>
        </div>
       </div>
    );
  }
};
class Editor extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3 className="h3 edit">Editor:</h3>
        <textarea type="text"
          id="editor"
          value={this.props.input}
          onChange={this.props.handleChange}/>
      </div>
    );
  }
};
class Previewer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3 className="h3">Previewer:</h3>
        <div id="preview" dangerouslySetInnerHTML={{__html: marked(this.props.input, { renderer: renderer })}}/>
      </div>
    );
  }
};

marked.setOptions({
  breaks: true,
});

const renderer = new marked.Renderer();
renderer.link = function(href,title,text) {
  return `<a target="_blank" href=${href}>${text}` + `</a>`
}

const placeholder = 
`# A Markdown Previewer!
## \`With React!\`

## We have headings...

You can use **bold** text. _Italic_ text.
~~Practically~~ everything you **_want_**.

1. We have lists.
- You don't have to use numbers.
* This one, for example...


- Bulleted lists...
  - with different kinds...
     - of bullets.

Block quotations are a thing. You:
> That's great!

You can write code: \`<html></html>\`. 

And with many lines:

\`\`\`
function myFunction(x, y) {
  if (x > 0  && x <= y ) {
    return x;
  }
}
\`\`\`

[Links](https://www.github.com) can be made: \`[Links](https://www.github.com)\`

And tables:

Header 1 | Header 2 | Header 3
- | - | - 
one | two | three
four | five | six
 
And of course, you can also embed images:

![Codepen](https://blog.codepen.io/wp-content/uploads/2012/06/Button-Fill-Black-Large.png)
`

ReactDOM.render(<Parent />, document.getElementById('mark'))