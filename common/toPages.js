function toPages() {
    //重载
    let len = arguments.length;
    if (4 == len) {
        let tot = arguments[0];
        let p = arguments[1];
        let size = arguments[2];
        let search = arguments[3];

        let start = (p - 1) * size;
        let pages = Math.ceil((tot / size));
        let show = "";
        show += `<div class="pagelist">`;
        show += `    <a href="?search=${search}&p=1">首页</a>`;
        show += `    <a href="?search=${search}&p=${p - 1 >= 1 ? p - 1 : 1}">上一页</a>`;
        show += `    <span class="current">${p}</span>`;
        show += `    <a href="?search=${search}&p=${Number(p) + 1 < pages + 1 ? Number(p) + 1 : pages}">下一页</a>`;
        show += `    <a href="?search=${search}&p=${pages}">尾页</a>`;
        show += `</div>`;
        show += `<br>`;
        show += `<span>共:${pages}页</span>`;
        return {
            start: start,
            size: size,
            show: show
        }
    } else {
        let tot = arguments[0];
        let p = arguments[1];
        let size = arguments[2];

        let start = (p - 1) * size;
        let pages = Math.ceil((tot / size));
        let show = "";
        show += `<div class="pagelist">`;
        show += `    <a href="?p=1">首页</a>`;
        show += `    <a href="?p=${p - 1 >= 1 ? p - 1 : 1}">上一页</a>`;
        show += `    <span class="current">${p}</span>`;
        show += `    <a href="?p=${{p} + 1 <= pages ? p + 1 : pages}">下一页</a>`;
        show += `    <a href="?p=${pages}">尾页</a>`;
        show += `</div>`;
        show += `<br>`;
        show += `<span>共:${pages}页</span>`;
        return {
            start: start,
            size: size,
            show: show
        }
    }
}

module.exports = toPages;