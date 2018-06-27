<template>
  <v-card>
    <v-card-title>
      <span v-if="title">{{ title }}</span>
      <v-spacer></v-spacer>
      <v-menu v-if="menu && menu.length" bottom left>
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="(item, i) in menu" :key="i" @click="item.click || function() {}">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-card-title>
    <slot></slot>
    <v-data-table
      v-if="table && table.items && table.items.length"
      :headers="table.headers"
      :items="table.items"
      hide-actions
    >
      <template slot="headerCell" slot-scope="props">
        <v-tooltip bottom>
          <span slot="activator">
            {{ props.header.text }}
          </span>
          <span>
            {{ props.header.text }}
          </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="props">
        <td><a :href="props.item.link" target="_blank">{{ props.item.tool }}</a></td>
        <td>{{ props.item.usage }}</td>
        <td>{{ props.item.ver }}</td>
      </template>
      <template slot="footer" v-if="table.footer">
        <td colspan="100%">
          <strong>{{ table.footer }}</strong>
        </td>
      </template>
    </v-data-table>
    <slot name="activator">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.stop="about=false">关闭</v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>


<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    menu: {
      type: Array,
      default: () => []
    },
    table: {
      type: Object,
      default: () => { items: [] }
    }
  }
}
</script>
