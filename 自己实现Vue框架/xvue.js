class Vue{
    constructor(options){
        this.$options = options;

        // data代理，使得options中的data可以被直接访问
        this.proxyData(this,this.$options.data);

        // 使得整个Vue子实例变为响应式的
        this.observe(this);

    }

    // 观察响应式对象
    observe(targetObject){
        if(typeof targetObject === 'object'){
            Object.keys(targetObject).forEach(key => {
                this.defineReactive(targetObject,key,targetObject[key])
            })
        }
    }

    // 响应化数据
    defineReactive(targetObject,key,originValue){
        if(typeof(originValue) === 'object'){
            this.observe(originValue)
        }
        Object.defineProperty(targetObject,key,{
            get(){
                return targetObject[`_${key}`,originValue] || originValue;
            },
            set:(newValue) => {
                if(newValue !== originValue){
                    targetObject[`_${key}`] = newValue;
                    if(typeof newValue === 'object'){
                        observe(newValue);
                    }
                    this.updateViews(newValue)
                }
            }
        })
    }


    // 更新视图
    updateViews(newValue){
        const targetDom = document.querySelector(this.$options.el);
        targetDom.innerText = JSON.stringify(newValue); 
    }

    // 数据代理
    proxyData(instance,data){
        Object.keys(data).forEach(key => {
            Object.defineProperty(instance,key,{
                get(){
                    return data[key];
                }
            })
        })
    }
}
