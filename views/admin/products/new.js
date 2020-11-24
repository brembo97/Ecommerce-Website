const layout = require('../layout');

module.exports = ({ errors }) => {
    return layout({
        content: `
            <div>
                <form method="POST">
                    <input placeholder="Title" name="title"/>
                    <input placeholder="Price" name="price"/>
                    <input type="file" name="image" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        `
    })
}