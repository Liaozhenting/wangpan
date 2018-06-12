var express = require('express');
var router = express.Router();


var data = [{
    key:"/root/",
    children:[
        {
            key:"/root/app/",
            children:[
                {
                    key:"/root/app/app.png"
                },
                {
                    key:"/root/app/test/",
                    children:[]
                }
            ]
        },
        {
            key:"/root/storage/",
            children:[
                {
                    key:"/root/storage/storage.png"
                }
            ]
        },
        {
            key:"/root/oter.txt"
        }
    ]
}];

function findNode(data, key) {
    const travelWidely = (roots) => {
        const queue = [...roots];
        while (queue.length) {
            const node = queue.shift();
            //打印被遍历的一个节点
            if (node.key === key) {
                //记录到
                return node;
            }
            if (node === undefined) return;
            if (node.children && node.children.length) {
                queue.push(...node.children)
            }
        }
    }
    return travelWidely(data)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/sts',function(req,res,next){

    let prefix = req.query.prefix;
    if(prefix.slice(0,1)!=="/") prefix="/"+prefix;
    let node = findNode(data,prefix);
    let fileList = []
    node.children.forEach((ele)=>{
        fileList.push(ele.key)
    })
    res.send({
        fileList,
        status:200
    })
})
module.exports = router;
