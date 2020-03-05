<template>
    <div>
        <span id="i1">1</span>
    </div>
</template>

<script>
    import * as example from "_pl/js/Hik/jsWebControl-1.0.0.min.js";
    export default {

        data(){
            return{
                oWebControl:"",
            }
        },
        created() {

            let s = example.value();
            window.console.log(s);
        }

    }
</script>

<style scoped>

</style>
