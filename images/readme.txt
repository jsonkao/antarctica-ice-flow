The model is a c-shell script, run at linux command line:
  >csh flowline_model.csh

Required input data sets, all in same projected coordinate system. Examples given were used to calculate results for
Bevan, S.L. et al., 'Centuries of melt on Larsen C Ice Shelf', 2017. Submitted to The Cryosphere Discussions.

  Par file with projection information
   - e.g. larsenc_250.dem_par 
   
  Surface trajectory vector
   - e.g. Cabinet_Inlet_forward_flowline.ps.txt
   - e.g.  Whirlwind_Inlet_forward_flowline.ps.txt
   
  Gridded surface mass balance in metres weq per year
  
  Gridded ice thickness and surface elevation data
   - e.g. Bedmap2 dataset from British Antarctic Survey (https://secure.antarctica.ac.uk/data/bedmap2/)
   
  Gridded surface velocity magnitude, and +/- 10% values.
   - e.g. MEaSURES Antarctic velocity dataset, available from the NSIDC (https:\/nsidc.org/data/docs/measures/nsidc0484_rignot/)
   
  Gridded vertical strain rate
  
  Depth Density data (Depth, density, mean density from surface to depth)
   - e.g. lcis_density_summary_CI_120.mean.txt
   - e.g. lcis_density_summary_WI_70.mean.txt 

Software
   Generic Mapping Tools  (http://www.soest.hawaii.edu/gmt/) and R (https://www.r-project.org/).

Output data columns are:
      #$1 = easting
      #$2 = northing
      #$3 = segment length
      #$4 = along flow velocity magnitude
      #$5 = smb rate
      #$6 = vstrain rate
      #$7 = ice shelf thickness
      #$8 = ice shelf surface elevation
      #$9 = cell residence time
      #$10 = smb per cell
      #$11 = accumulated time
      #$12 = accumulated distance
      #$13 = accumulated smb
      #$14 = accumulated z1 from start point 1 etc.
      #$15 = accumulated z2
      #$16 = accumulated z3
      #$17 = accumulated z4
      #$18 = accumulated z5
      #$19 = accumulated z6
