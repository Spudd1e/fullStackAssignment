
import PostView from './PostView.vue';

<template>
    <div>
        <button class="rounded-md p-2 w-fit text-blue-400" @click="handleEditPost ">Edit</button>
    </div>
</template>
<script>

import PostView from '../../components/PostView.vue'


export default {
    inject:['emitter'],
    props:['post_text','post_id'],
    components:{PostView}
    ,methods:{
        handleEditPost(){
            this.emitter.emit("editPost", ([this.$props.post_text, this.$props.post_id]))
            
        }
    }
    
    
}

</script>