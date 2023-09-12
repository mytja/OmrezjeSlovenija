<script lang="ts">
  import Autocomplete from '@smui-extra/autocomplete';
  import { Text } from '@smui/list';
  import CircularProgress from '@smui/circular-progress';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

  let address = null;
  let tocke = [];

  async function searchItems(input: string) {
    if (input.length < 4) {
      return [];
    }

    let r = await fetch(`https://gis-proxy.severkar.eu/api/GURS/FullSearch?term=${input}`)
    return await r.json();
  }

  async function getOPT(x: number, y: number) {
    let r = await fetch(`https://gis-proxy.severkar.eu/api/akos/info?layers=OPT&x=${x}&y=${y}&tolerance=0.5`)
    let j = await r.json();

    let tables = j.tables;
    for (let i: number = 0; i < tables.length; i++) {
      if (tables[i].name !== "OPT") {
        continue;
      }
      tocke = tables[i].records;
    }
  }

  async function getLocation() {
    if (address === null) {
      return;
    }

    if (address.HasGeometry === false) {
      return;
    }

    let r = await fetch(`https://gis-proxy.severkar.eu/api/Akos/GetGeometry?table=hs&id=${address.Id}`)
    let j = await r.json();
    let coords = j.coordinates;
    let x = coords[0];
    let y = coords[1];

    await getOPT(x, y);
  }
</script>

<main>
  <h1>Omrežje Slovenije</h1>

  <Autocomplete
      search={searchItems}
      bind:value={address}
      on:click={async () => {
        await getLocation();
      }}
      showMenuWithNoInput={false}
      label="Ulica in hišna številka"
      getOptionLabel={(option) => option ? option.FullText : ''}
      style="width: 100%;"
      textfield$style="width: 100%;"
  >
    <Text slot="loading" style="display: flex; width: 100%; justify-content: center; align-items: center;">
      <CircularProgress style="height: 24px; width: 24px;" indeterminate />
    </Text>
  </Autocomplete>

  {#if tocke.length !== 0}
    <p/>
    <h2>Omrežne priključne točke</h2>
    <DataTable table$aria-label="People list" style="max-width: 100%;">
      <Head>
        <Row>
          <Cell>Lastnik priključka</Cell>
          <Cell>Vrsta priključka</Cell>
          <Cell>Minimalna zmogljivost priključka</Cell>
          <Cell>Vrsta subjekta</Cell>
          <Cell>Stanje priklopa</Cell>
          <Cell>Število priključkov</Cell>
          <Cell>Naslov priključka</Cell>
        </Row>
      </Head>
      <Body>
        {#each tocke as opt}
          <Row>
            <Cell>{opt.popolno_ime}</Cell>
            <Cell>{opt.vrsta_prikljucka_opis}</Cell>
            <Cell>{opt.min_zmogljivost} Mbps</Cell>
            <Cell>{opt.vrsta_subjekta_opis}</Cell>
            <Cell>{opt.priklop_opis}</Cell>
            <Cell>{opt.stevilo}</Cell>
            <Cell>{opt.naslov}</Cell>
          </Row>
        {/each}
      </Body>
    </DataTable>
  {/if}
</main>
